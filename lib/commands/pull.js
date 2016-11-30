var download = require('../download')

module.exports = {
  name: 'pull',
  options: [],
  command: function (opts) {
    // Force these options for pull command
    opts.resume = true
    opts.exit = true
    download('pull', opts)
  }
}

