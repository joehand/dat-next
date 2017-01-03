var debug = require('debug')('dat')

module.exports = function (opts) {
  if (!opts.debug) return function () { }

  if (typeof opts.debug === 'string') process.env.DEBUG = opts.debug
  else process.env.DEBUG = 'dat'

  debug.enabled = true // TODO: why do I have to manually enable here?

  return debug
}
