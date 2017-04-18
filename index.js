var Dat = require('dat-node')
var encoding = require('dat-encoding')
// var debug = require('debug')('dat')
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

  if (dest) {
    // Downloading
    try {
      // validate key + remove dat:// stuff
      opts.key = encoding.toStr(src)
    } catch (e) {
      return cb(new Error('Invalid dat link'))
    }
    src = null
  } else {
    opts.indexing = true
  }

  Dat(storage(src || dest, opts), opts, function (err, dat) {
    if (err) return cb(err)
    if (!dat.writable && !dest) {
      return cb(new Error('Archive is not writable and no destination provided.'))
    }

    dat.joinNetwork(opts)
    dat.trackStats()
    if (dat.writable) {
      dat.importFiles(src, {
        watch: opts.watch,
        dereference: true
      })
    }

    cb(null, dat)
  })
}
