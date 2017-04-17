var fs = require('fs')
var path = require('path')
var xtend = require('xtend')
var hyperdrive = require('hyperdrive')
var network = require('hyperdiscovery')
var mirror = require('mirror-folder')
var count = require('count-files')
var datIgnore = require('dat-ignore')
var encoding = require('dat-encoding')
var debug = require('debug')('dat')
var storage = require('./storage')

module.exports = run

/**
 * Run dat-next
 * @param  {string}   src   directory or key (for downloading)
 * @param  {string}   dest  directory to download to, required for download
 * @param  {object}   opts  options
 * @param  {Function} cb    callback(err, archive, swarm, progress)
 */
function run (src, dest, opts, cb) {
  if (!opts) opts = {}

  var key
  if (dest) {
    // Downloading
    try {
      // validate key + remove dat:// stuff
      key = encoding.toStr(src)
    } catch (e) {
      return cb(new Error('Invalid dat link'))
    }
    src = null
  } else {
    opts.indexing = true
  }

  var progress
  var ignore = datIgnore(src || dest)
  var archive = hyperdrive(storage(src || dest, opts), key, opts)

  archive.on('ready', function () {
    if (!archive.metadata.writable && !dest) {
      return cb(new Error('Archive is not writable and no destination provided.'))
    }
    if (archive.metadata.writable) importFiles()
    var swarm = joinNetwork()
    cb(null, archive, swarm, progress)
  })

  function importFiles () {
    if (!archive.metadata.writable) return

    progress = mirror(src, {name: '/', fs: archive}, {
      live: opts.watch,
      ignore: ignore,
      dereference: true
    })

    progress.on('error', function (err) {
      debug('IMPORT ERROR:', err)
    })

    progress.count = count(src, { ignore: ignore, dereference: true }, function (err, data) {
      if (err) return progress.emit('error', err)
      progress.emit('count', data)
    })

    return progress
  }

  function joinNetwork () {
    var swarm = network(archive, xtend({
      stream: function (peer) {
        var stream = archive.replicate({
          live: true // !archive.metadata.writable && opts.sync
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
