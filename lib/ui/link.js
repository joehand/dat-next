var datKeyAs = require('dat-key-as')

module.exports = function (key) {
  return `Link: dat://${datKeyAs.str(key)}`
}
