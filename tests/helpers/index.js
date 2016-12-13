var fs = require('fs')
var os = require('os')
var path = require('path')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var recursiveReadSync = require('recursive-readdir-sync')
var Dat = require('dat-node')
var hypercore = require('hypercore')
var memdb = require('memdb')
var swarm = require('hyperdiscovery')

module.exports.matchLink = matchDatLink
module.exports.isDir = isDir
module.exports.testFolder = newTestFolder
module.exports.shareFixtures = shareFixtures
module.exports.shareFeed = shareFeed
module.exports.fileList = fileList

function shareFixtures (opts, cb) {
  if (typeof opts === 'function') return shareFixtures(null, opts)
  opts = opts || {}
  var fixtures = path.join(__dirname, '..', 'fixtures')
  // os x adds this if you view the fixtures in finder and breaks the file count assertions
  try { fs.unlinkSync(path.join(fixtures, '.DS_Store')) } catch (e) { /* ignore error */ }

  rimraf.sync(path.join(fixtures, '.dat'))
  Dat(fixtures, {}, function (err, dat) {
    if (err) throw err
    dat.trackStats()
    dat.joinNetwork()
    if (opts.import === false) return cb(null, dat)
    dat.importFiles(function (err) {
      if (err) throw err
      cb(null, dat)
    })
  })
}

function fileList (dir) {
  try {
    return recursiveReadSync(dir)
  } catch (e) {
    return []
  }
}

function newTestFolder () {
  var tmpdir = path.join(os.tmpdir(), 'dat-download-folder')
  rimraf.sync(tmpdir)
  mkdirp.sync(tmpdir)
  return tmpdir
}

function matchDatLink (str) {
  var match = str.match(/[A-Za-z0-9]{64}/)
  if (!match) return false
  return match[0].trim()
}

function isDir (dir) {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (e) {
    return false
  }
}

function shareFeed (cb) {
  var core = hypercore(memdb())
  var feed = core.createFeed()
  feed.append('hello world', function (err) {
    if (err) throw err
    cb(null, feed.key.toString('hex'), close)
  })
  var sw = swarm(feed)

  function close (cb) {
    feed.close(function () {
      sw.close(cb)
    })
  }
}
