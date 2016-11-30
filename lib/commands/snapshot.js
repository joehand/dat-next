var create = require('./create')

module.exports = {
  name: 'snapshot',
  options: [],
  command: function snapshot (opts) {
    // Force these options for snapshot command
    opts.resume = false
    opts.live = false
    opts.import = true
    create.command(opts)
  }
}
