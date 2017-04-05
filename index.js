var fs = require('fs')
var path = require('path')
var xtend = require('xtend')
var mkdirp = require('mkdirp')
var hyperdrive = require('hyperdrive')
var network = require('hyperdiscovery')
var ram = require('random-access-memory')
var secretStore = require('dat-secret-storage')
var mirror = require('mirror-folder')
var count = require('count-files')
var datIgnore = require('dat-ignore')
var encoding = require('dat-encoding')
var debug = require('debug')('dat')

module.exports = run

function run (src, dest, opts, cb) {
  if (!opts) opts = {}

  var key
  if (dest) {
    try {
      // validate key + remove dat:// stuff
      key = encoding.toStr(src)
    } catch (e) {
      return cb(new Error('Invalid dat link'))
    }
    src = null
  }

  var archive = hyperdrive(storage(), key, opts)
  archive.on('ready', function () {
    var progress = importFiles()
    var swarm = joinNetwork()
    cb(archive, swarm, progress)
  })

  if (opts.sparse) {
    if (typeof opts.sparse === 'string') {
      downloadFiles(opts.sparse)
    } else {
      var syncFile = path.join(dest, '.datsync')
      fs.readFile(syncFile, 'utf-8', function (err, data) {
        if (err) throw err
        data = data.split('\n')
        downloadFiles(data)
      })
    }

    function downloadFiles (list) {
      console.log('downloading files', list)
      // TODO
    }
  }

  function storage () {
    if (!opts.sleep) return ram
    if (typeof opts.sleep === 'string') return secretStore(opts.sleep)
    if (!src) {
      mkdirp.sync(dest)
      return path.join(dest, '.dat') // TODO: if dest is file
    }

    var isDir = fs.statSync(src).isDirectory()
    if (isDir) return secretStore(path.join(src, '.dat'))
    return cb(new Error('Specify dir for sleep files: --sleep <dir>'))
  }

  function importFiles () {
    if (!archive.metadata.writable) return
    var progress
    var ignore = datIgnore(src)

    progress = mirror(src, {name: '/', fs: archive}, {
      live: opts.watch,
      ignore: ignore,
      dereference: true
    })

    progress.on('error', function (err) {
      debug('IMPORT ERROR:', err)
    })

    count(src, { ignore: ignore, dereference: true }, function (err, data) {
      if (err) return progress.emit('error', err)
      progress.emit('count', data)
    })

    return progress
  }

  function joinNetwork () {
    var swarm = network(archive, xtend({
      stream: function (peer) {
        var stream = archive.replicate({
          live: !archive.metadata.writable && opts.sync
        })
        stream.on('error', function (err) {
          debug('Replication error:', err.message)
        })
        stream.on('end', function () {
          archive.downloaded = true
        })
        return stream
      }
    }, opts))
    return swarm
  }
}
