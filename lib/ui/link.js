var encoding = require('dat-encoding')

module.exports = function (key) {
  return `Link: ${encoding.encode(key)}`
}
