var Dat = require('dat-node')
var download = require('../download')
var exitErr = require('../ui').exitErr
var Debug = require('../debug')

module.exports = {
  name: 'pull',
  options: [],
  command: function (opts) {
    var debug = Debug(opts)
    // Force these options for pull command
    opts.resume = true
    opts.exit = true

    debug('Pulling Dat archive in', opts.dir)
    Dat(opts.dir, opts, function (err, dat) {
      if (err) return ui.exit(err)
      if (dat.owner) return exitErr('Cannot pull an archive that you own.')
      download('pull', opts, dat)
    })
  }
}
