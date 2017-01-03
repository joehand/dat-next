var Dat = require('dat-node')
var download = require('../download')
var exitErr = require('../ui').exitErr
var debug = require('debug')('dat')

module.exports = {
  name: 'pull',
  options: [],
  command: function (opts) {
    // Force these options for pull command
    opts.resume = true
    opts.exit = true

    debug('Pulling Dat archive in', opts.dir)
    Dat(opts.dir, opts, function (err, dat) {
      if (err) return exitErr(err)
      if (dat.owner) return exitErr('Cannot pull an archive that you own.')
      download('pull', opts, dat)
    })
  }
}
