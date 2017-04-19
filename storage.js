var fs = require('fs')
var ram = require('random-access-memory')
// var secretStore = require('dat-secret-storage')
var datStore = require('dat-storage')
var mkdirp = require('mkdirp')

module.exports = storage

function storage (dir, opts) {
  if (opts.temp) return ram
  if (typeof opts.sleep === 'string') return opts.sleep
  // if (typeof opts.sleep === 'string') return secretStore(datStore(opts.sleep))

  mkdirp.sync(dir)
  try {
    var isDir = fs.statSync(dir).isDirectory()
    if (isDir) return datStore(dir)
    // if (isDir) return secretStore(datStore(dir))
    error()
  } catch (e) {
    throw e
  }

  function error () {
    // TODO: single file sleep storage
    throw new Error('Specify dir for sleep files: --sleep <dir>')
  }
}
