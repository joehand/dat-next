var xtend = require('xtend')
var TownshipClient = require('township-client')

module.exports = function (opts) {
  var defaults = {
    server: 'https://auth.dat.land',
    config: {
      filename: '.datrc'
    }
  }
  var options = xtend(defaults, opts)
  return TownshipClient(options)
}
