var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var Dat = require('dat-node')
var ui = require('../ui')
var datJson = require('../dat-json')
var Debug = require('../debug')

module.exports = {
  name: 'create',
  command: create,
  options: [
    {
      name: 'import',
      boolean: true,
      default: true
    }
  ]
}

function create (opts) {
  var debug = Debug(opts)
  opts.resume = false // cannot resume for create

  var importStatus = null

  // Logging Init
  var output = [
    'Creating Dat Archive...', // Shows Folder
    '', // Shows Link
    '', // Importing Progress
    ''  // Total Size
  ]
  var log = logger(output, {debug: opts.verbose, quiet: opts.quiet || opts.debug})

  // UI Elements
  var importUI = ui.importProgress()
  var exit = ui.exit(log)

    // Printing Things!!
  setInterval(function () {
    if (importStatus) updateProgress()
    log.print()
  }, opts.logspeed)

  debug('Creating Dat archive in', opts.dir)
  Dat(opts.dir, opts, function (err, dat) {
    if (err) return exit(err)

    // General Archive Info
    output[0] = `Dat ${opts.live !== false ? 'Archive' : 'Snapshot Archive'} initialized: ${dat.path}`
    if (dat.key) output[1] = ui.link(dat.key) + '\n'
    else output[1] = 'Creating link...' + '\n'
    if (opts.quiet && dat.key) process.stdout.write(ui.link(dat.key))

    if (dat.owner) {
      datJson.read(dat, function (err, body) {
        if (!err) return importFiles() // TODO: if dat.json exists, then what?
        if (err.code === 'ENOENT' || !body) {
          return datJson.write(dat, function (err) {
            if (err) return exit(err)
            importFiles()
          })
        }
        return exit(err)
      })
    }

    function importFiles () {
      // Not importing files. Just create .dat, print info, and exit.
      if (!opts.import) return exit()
      debug('Importing files into archive')

      output[2] = 'Importing files to archive...'
      importStatus = dat.importFiles(function (err) {
        if (err) return exit(err)
        output[2] = opts.live !== false ? 'File import finished!' : 'Snapshot created!'
        output[3] = `Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`

        debug('Dat archive created')
        if (dat.key) debug(ui.link(dat.key))

        if (opts.live !== false) return exit()
        if (dat.key) output[1] = ui.link(dat.key) + '\n'

        exit()
      })
    }
  })

  function updateProgress () {
    output[2] = importUI(importStatus)
  }
}
