module.exports = function (opts) {
  // Force these options for pull command
  opts.resume = true
  opts.exit = true
  require('../lib/download')('pull', opts)
}
