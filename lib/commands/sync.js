var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var Dat = require('dat-node')
var ui = require('../ui')
var download = require('../download')

module.exports = {
  name: 'sync',
  command: sync,
  options: [
    {
      name: 'import',
      boolean: true,
      default: true
    }
  ]
}

function sync (opts) {
  // Gets overwritten by logger.
  // Logging starts after Dat cb for lib/download sync
  process.stdout.write('Starting Dat...')

  // Set default options (some of these may be exposed to CLI eventually)
  opts.resume = true // sync must always be a resumed archive
  opts.exit = false

  // **** NOTES ****
  // download sync action is in lib/download
  // TODO: move share sync to separate file
  // ****************

  var importDone = false
  var importStatus = null
  var network = null
  var stats = null

  Dat(opts.dir, opts, function (err, dat) {
    if (err) return ui.exitErr(err)
    if (!dat.owner) {
      // Downloading sync, move to lib/download
      return download('sync', opts, dat)
    }

    // Logging Init.
    // After download require because downloader has it's own logger
    var output = [
      [
        'Starting Dat...', // Shows Folder Name
        '', // Shows Link
        '', // Shows Importing Progress Bar
        '', // Shows Total Size Info
        '' //  spacer before network info
      ],
      [] // Shows network information
    ]
    var progressOutput = output[0] // shortcut for progress output
    var log = logger(output, {debug: false, quiet: false})

    // UI Elements
    var importUI = ui.importProgress()
    var exit = ui.exit(log)

    // Printing Things!!
    setInterval(function () {
      if (importStatus && !importDone) updateImport()
      if (network) updateNetwork()
      log.print()
    }, opts.logspeed)

    // General Archive Info
    progressOutput[0] = `Syncing Dat Archive: ${dat.path}`
    progressOutput[1] = ui.link(dat.key) + '\n'

    // Stats (used for network + download)
    stats = dat.trackStats()

    // Network
    network = dat.joinNetwork(opts)

    if (dat.owner && opts.import) {
      // File Imports
      progressOutput[2] = 'Importing new & updated files to archive...'

      // TODO: allow live: true
      importStatus = dat.importFiles({live: false, resume: true}, function (err) {
        if (err) return exit(err)
        importDone = true
        progressOutput[2] = 'Archive update finished! Sharing latest files.'
        progressOutput[3] = `Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`
      })
    }

    function updateImport () {
      progressOutput[2] = importUI(importStatus)
    }

    function updateNetwork () {
      output[1] = ui.network(network.peers(), stats.network)
    }
  })
}
