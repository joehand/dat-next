var assert = require('assert')
var debug = require('debug')('dat')
var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var rimraf = require('rimraf')
var memdb = require('memdb')
var Dat = require('dat-node')
var ui = require('./ui')

module.exports = function (type, opts, dat) {
  assert.ok(type, 'lib/download download type required')
  assert.ok(['sync', 'clone', 'pull'].indexOf(type) > -1, 'lib/download download type must be sync, clone, pull')
  debug('download: ' + type + ' on ' + dat.key)

  // TODO: clean up this logic
  var resume = opts.resume || false
  if (!opts.key && !resume) return ui.exit()('lib/download Key required to download')

  var network = null
  var stats = null
  var archive = null
  var connected = false
  var metadataDownloaded = false
  var contentPopulated = false

  // Logging Init
  var output = [
    [
      'Starting Dat...', // Shows Folder Name
      '', // Shows Link
      '', // Shows Downloading Progress Bar
      '', // Shows Total Size Info
      '' //  spacer before network info
    ],
    [] // Shows network information
  ]
  var progressOutput = output[0] // shortcut for progress output
  var log = logger(output, {debug: false, quiet: opts.quiet})

  // UI Elements
  var bar = ui.bar()
  var exit = ui.exit(log)

  // Printing Things!!
  setInterval(function () {
    if (stats) updateDownload()
    if (network) updateNetwork()
    log.print()
  }, opts.logspeed)

  // Action starts here
  if (opts.temp) opts.db = memdb()
  if (!dat) Dat(opts.dir, opts, start)
  else start(null, dat)

  function start (err, dat) {
    if (err) return exit(err)
    archive = dat.archive

    // General Archive Info
    var niceType = (type === 'clone') ? 'Cloning' : type.charAt(0).toUpperCase() + type.slice(1) + 'ing'
    progressOutput[0] = `${niceType} Dat Archive: ${dat.path}`
    progressOutput[1] = ui.link(dat.key) + '\n'
    if (opts.quiet && type !== 'clone') process.stdout.write(ui.link(dat.key))

    // Stats
    stats = dat.trackStats()
    stats.on('update:blocksProgress', checkDone)

    // Network
    network = dat.joinNetwork(opts)
    network.swarm.once('connection', function (peer) {
      connected = true
      progressOutput[2] = 'Starting Download...'

      if (archive.metadata.blocksRemaining() === 0) {
        metadataDownloaded = true
        archive.metadata.on('update', onMetadataUpdate)
      }
    })
    progressOutput[2] = 'Looking for Dat Archive in Network'

    // Metadata Download
    archive.metadata.once('download-finished', function () {
      metadataDownloaded = true

      // Live metadata updates
      // TODO: this can be buggy if there are lots of metadata updates
      archive.metadata.on('update', onMetadataUpdate)
    })

    // Content is populated
    // TODO: couldn't get one these to work for all situations
    // if content.blocks = zero there is no downloads
    archive.once('content', function () {
      contentPopulated = true
    })
    archive.open(function () {
      if (!archive.content) return removeExit()
      archive.content.once('download', function () {
        contentPopulated = true
      })
    })

    function onMetadataUpdate () {
      if (metadataDownloaded) {
        metadataDownloaded = false
        archive.metadata.once('download-finished', function () {
          metadataDownloaded = true
        })
      }
    }

    function removeExit () {
      output[0] = ['']
      output[1] = ['']
      log.print()
      rimraf.sync(dat.path)
      return exit('Link is not a Dat Archive. Please check you have the correct link.')
    }
  }

  function updateDownload () {
    var st = stats.get()

    // TODO: blocksTotal may be slow to populate for large metadata, need to handle that
    // TODO: currently code is buggy for very frequent metadata updates
    if (!metadataDownloaded || !contentPopulated) {
      progressOutput[2] = '... Fetching Metadata'
      progressOutput[3] = ''
      return
    }

    // TODO: think about how this could work for empty archives & slow metadata downloads
    var progress = st.blocksTotal === 0 ? 100 : Math.round(st.blocksProgress * 100 / st.blocksTotal)
    if (progress === 100 && checkDone()) return
    progressOutput[2] = bar(progress)
    if (!connected) progressOutput[3] = 'Waiting for connections to update progress...'
    else progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})`
  }

  function updateNetwork () {
    output[1] = ui.network(network.peers(), stats.network)
  }

  function checkDone () {
    var st = stats.get()
    if (!connected || !metadataDownloaded || !contentPopulated) return false
    if (st.blocksTotal !== archive.content.blocks) return false // TODO: hyperdrive-stats bug?
    if (archive.content.blocksRemaining() !== 0) return false

    progressOutput[2] = (type === 'sync') ? 'Files updated to latest!' : 'Download Finished!'
    progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})`

    if (!opts.exit) return true

    // Exit!
    output[1] = '' // remove network info
    return exit()
  }
}
