var Dat = require('dat-node')
var download = require('../download')
var share = require('../share')
var exit = require('../ui').exitErr

module.exports = {
  name: 'sync',
  options: [
    {
      name: 'import',
      boolean: true,
      default: true
    }
  ],
  command: function (opts) {
    // Gets overwritten by logger.
    // Logging starts after Dat cb for lib/download sync
    // So we need this to show something right away
    if (!opts.quiet) process.stdout.write('Starting Dat...')

    // Set default options (some of these may be exposed to CLI eventually)
    opts.resume = true // sync must always be a resumed archive
    opts.exit = false

    Dat(opts.dir, opts, function (err, dat) {
      if (err) return exit(err)
      process.stdout.write('hi')
      if (!dat.owner) return download('sync', opts, dat)
      // TODO: dat.owner is false for snapshot on resume? bug?
      // if (!dat.archive.live) opts.import = false
      share('sync', opts, dat)
    })
  }
}
