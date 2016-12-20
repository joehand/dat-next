var Dat = require('dat-node')
var download = require('../download')
var ui = require('../ui')

module.exports = {
  name: 'pull',
  options: [],
  command: function (opts) {
    // Force these options for pull command
    opts.resume = true
    opts.exit = true

    Dat(opts.dir, opts, function (err, dat) {
      if (err) return ui.exit(err)
      if (dat.owner) return ui.exit()('Cannot pull an archive that you own.')
      download('pull', opts, dat)
    })
  }
}
