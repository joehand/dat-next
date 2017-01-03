var assert = require('assert')
var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var Dat = require('dat-node')
var ui = require('./ui')
var Debug = require('./debug')

module.exports = function sync (type, opts, dat) {
  assert.ok(type, 'lib/share share type required')
  assert.ok(['sync'].indexOf(type) > -1, 'lib/share type must be sync')

  var debug = Debug(opts)
  debug('Share: ' + type + ' on ' + dat.key.toString('hex'))

  var importDone = false
  var importStatus = null
  var network = null
  var stats = null

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
  var log = logger(output, {debug: opts.verbose, quiet: opts.quiet || opts.debug}) // If debug=true we want output to be quiet.

  // UI Elements
  var importUI = ui.importProgress()
  var exit = ui.exit(log)

  // Printing Things!!
  setInterval(function () {
    if (importStatus && !importDone) updateImport()
    if (network) updateNetwork()
    log.print()
  }, opts.logspeed)

  // Action starts here
  if (!dat) Dat(opts.dir, opts, start)
  else start(null, dat)

  function start (err, dat) {
    if (err) return exit(err)

    // General Archive Info
    progressOutput[0] = `Syncing Dat Archive: ${dat.path}`
    progressOutput[1] = ui.link(dat.key) + '\n'
    if (opts.quiet) process.stdout.write(ui.link(dat.key))

    // Stats (used for network + download)
    stats = dat.trackStats()

    // Network
    network = dat.joinNetwork(opts)
    network.swarm.once('connection', function () {
      debug('Network: first peer connected')
    })

    if (dat.owner && opts.import) {
      debug('Importing updated & new files into archive')
      // File Imports
      progressOutput[2] = 'Importing new & updated files to archive...'

      // TODO: allow live: true
      importStatus = dat.importFiles({live: false, resume: true}, function (err) {
        if (err) return exit(err)
        debug('Import finished')
        importDone = true
        progressOutput[2] = 'Archive update finished! Sharing latest files.'
        progressOutput[3] = `Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`
      })
    }
  }

  function updateImport () {
    progressOutput[2] = importUI(importStatus)
  }

  function updateNetwork () {
    output[1] = ui.network(network.connected, stats.network)
  }
}
