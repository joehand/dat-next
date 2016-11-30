var assert = require('assert')
var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var Dat = require('dat-node')
var ui = require('./ui')

module.exports = function (type, opts, dat) {
  assert.ok(type, 'lib/download download type required')
  assert.ok(['sync', 'clone', 'pull'].indexOf(type) > -1, 'lib/download download type must be sync, clone, pull')

  // TODO: clean up this logic
  var resume = opts.resume || false
  if (!opts.key && !resume) return ui.exit()('lib/download Key required to download')

  var network = null
  var stats = null
  var connected = false

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
  var log = logger(output, {debug: false, quiet: false})

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
  if (!dat) Dat(opts.dir, opts, start)
  else start(null, dat)

  function start (err, dat) {
    if (err) return exit(err)

    // General Archive Info
    var niceType = (type === 'clone') ? 'Cloning' : type.charAt(0).toUpperCase() + type.slice(1) + 'ing'
    progressOutput[0] = `${niceType} Dat Archive: ${dat.path}`
    progressOutput[1] = ui.link(dat.key) + '\n'

    // Stats
    stats = dat.trackStats()
    stats.on('update:blocksProgress', checkDone)

    // Network
    network = dat.joinNetwork(opts)
    network.swarm.once('connection', function (peer) {
      connected = true
      progressOutput[2] = 'Starting Download...'
    })
    progressOutput[2] = 'Looking for Dat Archive in Network'
  }

  function updateDownload () {
    var st = stats.get()
    if (!st.blocksTotal) {
      progressOutput[2] = '... Fetching Metadata'
      return
    }

    var progress = Math.round(st.blocksProgress * 100 / st.blocksTotal)
    if (progress === 100) return checkDone()
    progressOutput[2] = bar(progress)
    if (!connected) progressOutput[3] = 'Waiting for connections to update progress...'
    else progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})`
  }

  function updateNetwork () {
    output[1] = ui.network(network.peers(), stats.network)
  }

  function checkDone () {
    var st = stats.get()
    var completed = (connected && st.blocksTotal && st.blocksProgress === st.blocksTotal)
    if (completed) {
      progressOutput[2] = (type === 'sync') ? 'Files updated to latest!' : 'Download Finished!'
      progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})`
      if (opts.exit !== false) return exit()
    }
  }
}
