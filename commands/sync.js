var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var createDat = require('../lib')
var ui = require('../ui')

module.exports = function (opts) {
  var dir = opts.dir
  var bar = ui.bar()
  var connected = false
  var downloader = false
  var importDone = false
  var importStatus = null
  var network = null
  var stats = null

  var output = [['Starting Dat...'], []]
  var log = logger(output, {debug: false, quiet: false})
  var progressOutput = output[0]
  var netOutput = output[1]

  setInterval(function () {
    if (stats && downloader) updateDownload()
    if (importStatus && !importDone) updateImport()
    if (network) updateNetwork()
    log.print()
  }, opts.logspeed)

  createDat(dir, {resume: true}, function (err, dat) {
    if (err) return exit(err)
    var archive = dat.archive

    // General Archive Info
    progressOutput[0] = `Syncing Dat Archive: ${dir}`
    progressOutput.push(ui.link(archive) + '\n')

    // Stats (used for network + download)
    stats = dat.stats()

    // Network
    network = dat.network(opts)
    netOutput.push('Waiting for Dat Network connections...')

    if (!archive.owner) {
      // TODO: Download syncing
      downloader = true
      progressOutput.push('Looking for Dat Archive in Network')
      progressOutput.push('')
      network.swarm.once('connection', function (peer) {
        connected = true
        progressOutput[2] = 'Starting Download...'
      })
    }

    if (archive.owner && opts.import) {
      // File Imports
      progressOutput.push('Importing new & updated files to archive...')
      progressOutput.push('')

      // TODO: allow live: true
      importStatus = dat.importFiles({live: false, resume: true}, function (err) {
        if (err) return exit(err)
        importDone = true
        progressOutput[2] = 'Archive update finished! Sharing latest files.'
        progressOutput[3] = `Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`
        progressOutput.push('')
      })
    }
  })

  function updateDownload () {
    var st = stats.get()
    if (!st.blocksTotal) {
      progressOutput[2] = '... Fetching Metadata'
      return
    }
    var completed = st.blocksProgress === st.blocksTotal
    if (completed && connected) {
      progressOutput[2] = 'Files updated to latest!'
    } else if (completed) {
      progressOutput[2] = 'Waiting for connection to get latest data.'
    } else {
      var progress = Math.round(st.blocksProgress * 100 / st.blocksTotal)
      progressOutput[2] = bar(progress)
    }

    progressOutput[3] = `Total size: ${st.filesTotal} ${st.filesTotal === 1 ? 'file' : 'files'} (${prettyBytes(st.bytesTotal)})\n`
  }

  function updateImport () {
    var importedFiles = importStatus.fileCount - 1 // TODO: bug in importer?
    var progress = Math.round(importedFiles * 100 / importStatus.countStats.files)
    progressOutput[2] = bar(progress) + ' ' + importedFiles + ' files imported\n'
  }

  function updateNetwork () {
    netOutput = output[1] = ui.network(network.swarm.connections.length, stats.get())
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
