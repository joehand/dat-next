var Dat = require('dat-node')
var download = require('../download')
var share = require('../share')
var exit = require('../ui').exitErr
var debug = require('debug')('dat')

module.exports = {
  name: 'sync',
  options: [
    {
      name: 'import',
      boolean: true,
      default: true
    },
    {
      name: 'ignoreHidden',
      boolean: true,
      default: true,
      abbr: 'ignore-hidden'
    },
    {
      name: 'watch',
      boolean: true,
      default: true
    }
  ],
  command: function (opts) {
    // Gets overwritten by logger.
    // Logging starts after Dat cb for lib/download sync
    // So we need this to show something right away
    if (!opts.quiet && !opts.debug) process.stdout.write('Starting Dat...')

    // Set default options (some of these may be exposed to CLI eventually)
    opts.resume = true // sync must always be a resumed archive
    opts.exit = false

    debug('Reading archive in dir', opts.dir)

    Dat(opts.dir, opts, function (err, dat) {
      if (err) return exit(err)
      if (dat.owner) debug('Archive owner, syncing local updates to network')
      else debug('Not archive owner, syncing remote updates')

      if (!dat.owner) return download('sync', opts, dat)
      // TODO: dat.owner is false for snapshot on resume? bug?
      // if (!dat.archive.live) opts.import = false
      share('sync', opts, dat)
    })
  }
}
