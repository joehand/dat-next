var xtend = require('xtend')
var TownshipClient = require('township-client')

module.exports = function (opts) {
  var defaults = {
    // xtend doesn't overwrite when key is present but undefined
    // If we want a default, make sure it's not going to passed as undefined
  }
  if (!opts.config || !opts.config.filepath) opts.config.filename = '.datrc'
  if (!opts.server) {
    opts.server = 'https://datfolder.org' // use opts.server or xtend won't overwrite
    defaults.routes = {
      register: '/auth/v1/register',
      login: '/auth/v1/login',
      updatePassword: '/auth/v1/updatepassword'
    }
  }
  var options = xtend(defaults, opts)
  return TownshipClient(options)
}
