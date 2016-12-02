var datKeyAs = require('dat-key-as')

module.exports = function (key) {
  return `Link: ${datKeyAs.str(key)}`
}
