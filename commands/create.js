var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var Dat = require('dat-node')
var ui = require('../ui')

module.exports = function (opts) {
  opts.resume = false // cannot resume for create

  var importStatus = null

  // Logging Init
  var output = [
    'Creating Dat Archive...', // Shows Folder
    '', // Shows Link
    '', // Importing Progress
    ''  // Total Size
  ]
  var log = logger(output, {debug: false, quiet: false})

  // UI Elements
  var importUI = ui.importProgress()
  var exit = ui.exit(log)

  setInterval(function () {
    if (importStatus) updateProgress()
    log.print()
  }, opts.logspeed)

  Dat(opts.dir, opts, function (err, dat) {
    if (err) return exit(err)
    var archive = dat.archive

    output[0] = `Dat Archive initialized: ${dat.path}`
    output[1] = ui.link(archive) + '\n'
    if (!opts.import) return exit()

    output[2] = 'Importing files to archive...'
    importStatus = dat.importFiles({live: false, resume: false}, function (err) {
      if (err) return exit(err)
      output[2] = 'File import finished!'
      output[3] = `Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`
      exit()
    })
  })

  function updateProgress () {
    output[2] = importUI(importStatus)
  }
}
