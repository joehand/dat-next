var Dat = require('dat-node')
var encoding = require('dat-encoding')
// var debug = require('debug')('dat')
var storage = require('./storage')

module.exports = run

function run (src, dest, opts, cb) {
  opts = Object.assign({
    latest: false
  }, opts)

  if (dest) {
    // Downloading
    try {
      // validate key + remove dat:// stuff
      opts.key = encoding.toStr(src)
    } catch (e) {
      return cb(new Error('Invalid dat link'))
    }
    src = null
    opts.temp= true // use memory for downloads right now
  }

  Dat(storage(src || dest, opts), opts, function (err, dat) {
    if (err) return cb(err)
    if (!dat.owner && !dest) {
      return cb(new Error('Not archive owner and no destination provided.'))
    }

    dat.joinNetwork()
    // TODO
    // dat.trackStats()
    // if (dat.owner) {
    //   dat.importFiles(src, {
    //     watch: opts.watch,
    //     dereference: true
    //   })
    // }

    cb(null, dat)
  })
}
