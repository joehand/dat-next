var xtend = require('xtend')
var TownshipClient = require('township-client')

module.exports = function (opts) {
  var townshipOpts = {
    server: opts.server || 'https://datfolder.org',
    config: {
      filepath: opts.config || '.datrc'
    }
  }
  var defaults = {
    // xtend doesn't overwrite when key is present but undefined
    // If we want a default, make sure it's not going to passed as undefined
  }
  if (!opts.server || opts['use-routes']) {
    defaults.routes = {
      register: '/auth/v1/register',
      login: '/auth/v1/login',
      updatePassword: '/auth/v1/updatepassword'
    }
  }
  var options = xtend(defaults, townshipOpts)
  return TownshipClient(options)
}
