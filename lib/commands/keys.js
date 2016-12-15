var Dat = require('dat-node')
var exit = require('../ui').exitErr

module.exports = {
  name: 'keys',
  options: [
    {
      name: 'import',
      boolean: true,
      default: false
    }
  ],
  command: function (opts) {
    Dat(opts.dir, opts, function (err, dat) {
      if (err) return exit(err)
      if (!opts.import && dat.owner) {
        process.stdout.write(dat.archive.key.toString('hex') + '.' + dat.archive.metadata.secretKey.toString('hex'))
      }
    })
  }
}
