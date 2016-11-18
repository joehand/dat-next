var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var createDat = require('dat-node')
var ui = require('../ui')

module.exports = function (opts) {
  var dir = opts.dir
  var importStatus = null
  var bar = ui.bar()

  var output = ['Creating Dat Archive...']
  var log = logger(output, {debug: false, quiet: false})

  setInterval(function () {
    if (importStatus) updateProgress()
    log.print()
  }, opts.logspeed)

  createDat(dir, {resume: false}, function (err, dat) {
    if (err) return exit(err)
    var archive = dat.archive

    output[0] = `Dat Archive initialized: ${opts.dir}`
    output.push(ui.link(archive))
    if (!opts.import) return exit()

    output.push('')
    output.push('Importing files to archive...')

    importStatus = dat.importFiles({live: false, resume: false}, function (err) {
      if (err) return exit(err)
      output[3] = 'File import finished!'
      output.push(`Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`)
      exit()
    })
  })

  function updateProgress () {
    var importedFiles = importStatus.fileCount - 1 // TODO: bug in importer?
    var progress = Math.round(importedFiles * 100 / importStatus.countStats.files)
    output[3] = bar(progress) + ' ' + importedFiles + ' files imported'
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
