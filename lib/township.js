var xtend = require('xtend')
var TownshipClient = require('township-client')

module.exports = function (opts) {
  opts.server = opts.server || 'https://datfolder.org/auth/v1'
  if (!opts.config || !opts.config.filepath) opts.config.filename = '.datrc'
  var defaults = {
    // xtend doesn't overwrite when key is present but undefined
    // If we want a default, make sure it's not going to passed as undefined
  }
  var options = xtend(defaults, opts)
  return TownshipClient(options)
}
