var create = require('./create')
var debug = require('debug')('dat')

module.exports = {
  name: 'snapshot',
  help: [
    'Create a snapshot Dat archive',
    '',
    'Usage: dat snapshot'
  ].join('\n'),
  options: [],
  command: function snapshot (opts) {
    // Force these options for snapshot command
    opts.resume = false
    opts.live = false
    opts.import = true

    debug('Creating snapshot archive in', opts.dir)
    create.command(opts)
  }
}
