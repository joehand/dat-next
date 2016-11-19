var create = require('./create')

module.exports = function (opts) {
  // Force these options for snapshot command
  opts.resume = false
  opts.live = false
  opts.import = true
  create(opts)
}
