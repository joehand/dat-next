var logger = require('status-logger')
var prettyBytes = require('pretty-bytes')
var Dat = require('dat-node')
var ui = require('../ui')
var datJson = require('../dat-json')
var debug = require('debug')('dat')

module.exports = {
  name: 'create',
  command: create,
  help: [
    'Create a local Dat archive to share',
    '',
    'Usage: dat create [directory]'
  ].join('\n'),
  options: [
    {
      name: 'import',
      boolean: true,
      default: false,
      help: 'Import files in the given directory'
    },
    {
      name: 'ignoreHidden',
      boolean: true,
      default: true,
      abbr: 'ignore-hidden'
    }
  ]
}

function create (opts) {
  opts.resume = false // cannot resume for create
  if (opts._.length) opts.dir = opts._[0]

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
    output[0] = `Dat ${opts.live !== false ? 'Archive' : 'Snapshot Archive'} created: ${dat.path}`
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
      importStatus = dat.importFiles({
        // Can't pass through opts here. opts.live has two meanings (archive.live, live file watching)
        live: false, // Never live (file watching) for `dat create`
        resume: false, // Never resume for `dat create`
        ignoreHidden: opts.ignoreHidden
      }, function (err) {
        if (err) return exit(err)
        output[2] = opts.live !== false ? 'File import finished!' : 'Snapshot created!'
        output[3] = `Total Size: ${importStatus.fileCount} ${importStatus.fileCount === 1 ? 'file' : 'files'} (${prettyBytes(importStatus.totalSize)})`

        debug('Dat archive created')
        if (dat.key) debug(ui.link(dat.key))

        if (opts.live !== false) return exit()
        if (dat.key) output[1] = ui.link(dat.key) + '\n'

        exit()
      })
      importStatus.on('file imported', function (file) {
        debug(file)
      })
    }
  })

  function updateProgress () {
    output[2] = importUI(importStatus)
  }
}
