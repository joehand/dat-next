var path = require('path')
var xtend = require('xtend')
var mkdirp = require('mkdirp')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var mirror = require('mirror-folder')
var countDir = require('count-files')
var datIgnore = require('dat-ignore')
var debug = require('debug')('dat')
var cast = require('localcast')('dat-next')
var network = require('./lib/network')

module.exports = run

function run (src, dest, opts, cb) {
  var key
  var importProgress
  if (dest) {
    key = src
    src = null
    mkdirp.sync(dest)
  }
  var dir = dest || src
  opts = xtend({
    storage: opts.sleep ? path.join(dir, '.dat') : ram
  }, opts)
  var archive = hyperdrive(opts.storage, key, opts)

  archive.on('ready', function () {
    cast.emit('ready')
    if (!key) importFiles()
    var swarm = joinNetwork()
    cb(archive, swarm, importProgress)
  })

  function importFiles () {
    var ignore = datIgnore(dir)
    importProgress = mirror(dir, {name: '/', fs: archive}, {
      ignore: ignore
    })

    countDir(dir, { ignore: ignore }, function (err, data) {
      if (err) throw err
      cast.emit('import:count', data)
      importProgress.emit('count', data)
    })

    importProgress.on('put', function (src, dst) {
      cast.emit('import:put', src, dst)
    })
    importProgress.on('chunk', function (chunk) {
      cast.emit('import:chunk', chunk)
    })
    importProgress.on('del', function (dst) {
      cast.emit('import:del', dst)
    })
    importProgress.on('end', function () {
      cast.emit('import:end')
    })
    importProgress.on('error', function (err) {
      debug('IMPORT ERROR:', err)
    })
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
