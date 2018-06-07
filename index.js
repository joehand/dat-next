var Dat = require('dat-node')
var encoding = require('dat-encoding')

module.exports = run

function run (src, dest, opts, cb) {
  if (dest) {
    // Downloading
    try {
      // validate key + remove dat:// stuff
      opts.key = encoding.toStr(src)
    } catch (e) {
      return cb(new Error('Invalid dat link'))
    }
    src = null
  }

  Dat(src || dest, opts, function (err, dat) {
    if (err) return cb(err)
    if (!dat.owner && !dest) {
      return cb(new Error('Not archive owner and no destination provided.'))
    }

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
