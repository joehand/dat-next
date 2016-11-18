var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var createDat = require('dat-node')
var ui = require('../ui')

module.exports = function (opts) {
  var key = opts.key
  var dir = opts.dir
  var resume = opts.resume || false
  if (!key && !resume) return exit('Key required')

  var bar = ui.bar()
  var network = null
  var stats = null
  var connected = false

  var output = [['Starting Dat...'], []]
  var log = logger(output, {debug: false, quiet: false})
  var progressOutput = output[0]

  setInterval(function () {
    if (stats && connected) updateDownload()
    if (network) updateNetwork()
    log.print()
  }, opts.logspeed)

  createDat(dir, {resume: resume, key: key}, function (err, dat) {
    if (err) return exit(err)
    var archive = dat.archive

    // General Archive Info
    progressOutput[0] = `Cloning Dat Archive: ${dir}`
    progressOutput.push(ui.link(archive) + '\n')

    // Stats (used for network + download)
    stats = dat.stats()
    stats.on('update:blocksProgress', function () {
      checkDone()
    })
    progressOutput.push('Looking for Dat Archive in Network')
    progressOutput.push('')

    // Network
    network = dat.network(opts)
    network.swarm.once('connection', function (peer) {
      connected = true
      progressOutput[2] = 'Starting Download...'
    })
  })

  function updateDownload () {
    var st = stats.get()
    if (!st.blocksTotal) {
      progressOutput[2] = '... Fetching Metadata'
      return
    }

    var progress = Math.round(st.blocksProgress * 100 / st.blocksTotal)
    if (progress === 100) return checkDone()
    progressOutput[2] = bar(progress)
    progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})\n`
  }

  function updateNetwork () {
    output[1] = ui.network(network.swarm.connections.length, stats.get())
  }

  function checkDone () {
    var st = stats.get()
    if (connected && st.blocksTotal && st.blocksProgress === st.blocksTotal) {
      progressOutput[2] = 'Download Finished!'
      progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})\n`
      return exit()
    }
  }

  function exit (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    log.print()
    process.exit(0)
  }
}
