var fs = require('fs')
var path = require('path')
var ram = require('random-access-memory')
// var datStore = require('dat-storage')
var mkdirp = require('mkdirp')

module.exports = storage

function storage (dir, opts) {
  if (opts.temp) return ram
  var datDir = path.join(dir, '.dat')
  mkdirp.sync(datDir)
  return datDir
  // TODO dat-storage
  // try {
  //   var isDir = fs.statSync(dir).isDirectory()
  //   if (isDir) return datStore(dir)
  //   error()
  // } catch (e) {
  //   throw e
  // }
  // function error () {
  //   // TODO: single file sleep storage
  //   throw new Error('Specify dir for sleep files: --sleep <dir>')
  // }
}
