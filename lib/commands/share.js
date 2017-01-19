var Dat = require('dat-node')
var share = require('../share')
var exit = require('../ui').exitErr
var debug = require('debug')('dat')

module.exports = {
  name: 'share',
  help: [
    'Create and share a Dat archive',
    'Create a Dat, import files, and share to the network.',
    '',
    'Usage: dat share'
  ].join('\n'),
  options: [
    {
      name: 'import',
      boolean: true,
      default: true,
      help: 'Import files from the directory to the database.'
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
      default: false,
      help: 'Watch for changes and import updated files.'
    }
  ],
  command: function (opts) {
    // Gets overwritten by logger.
    // Logging starts after Dat cb for lib/download sync
    // So we need this to show something right away
    if (!opts.quiet && !opts.debug) process.stdout.write('Starting Dat...')

    // Set default options
    opts.resume = null // TODO: do we care if it was resumed?
    opts.exit = false

    debug('Reading archive in dir', opts.dir)

    Dat(opts.dir, opts, function (err, dat) {
      if (err) return exit(err)
      if (!dat.owner) exit('Existing archive that you do not own. Use `dat sync` to download updates.')

      // TODO: dat.json stuff we do in create.js?
      share('sync', opts, dat)
    })
  }
}
