var download = require('../lib/download')

module.exports = function (opts) {
  // Force these options for pull command
  opts.resume = true
  opts.exit = true
  download('pull', opts)
}
