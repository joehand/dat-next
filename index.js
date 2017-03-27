var path = require('path')
var xtend = require('xtend')
var mkdirp = require('mkdirp')
var hyperdrive = require('hyperdrive')
var network = require('hyperdiscovery')
var ram = require('random-access-memory')
var mirror = require('mirror-folder')
var countDir = require('count-files')
var datIgnore = require('dat-ignore')
var debug = require('debug')('dat')

module.exports = run

function run (src, dest, opts, cb) {
  var key
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
    var progress = importFiles()
    var swarm = joinNetwork()
    cb(archive, swarm, progress)
  })

  function importFiles () {
    if (!archive.metadata.writable) return
    var progress
    var ignore = datIgnore(dir)

    progress = mirror(dir, {name: '/', fs: archive}, {
      ignore: ignore
    })

    progress.on('error', function (err) {
      debug('IMPORT ERROR:', err)
    })

    countDir(dir, { ignore: ignore }, function (err, data) {
      if (err) throw err
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
