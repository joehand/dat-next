var xtend = require('xtend')
var TownshipClient = require('township-client')

module.exports = function (opts) {
  var defaults = {
    server: 'https://datfolder.org/auth/v1',
    config: {
      filename: '.datrc'
    }
  }
  var options = xtend(defaults, opts)
  return TownshipClient(options)
}
