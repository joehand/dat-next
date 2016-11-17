var fs = require('fs')

module.exports = function (opts) {
  opts.key = opts._[0]
  if (!opts.key) {
    console.error('key required to clone')
    process.exit(1)
  }

  opts.resume = false
  opts.dir = opts._[1] || opts.dir
  if (!opts.dir || opts.dir === process.cwd()) opts.dir = opts.key // Don't allow download to cwd for now
  try {
    fs.accessSync(opts.dir, fs.F_OK)
  } catch (e) { fs.mkdirSync(opts.dir) }
  require('./download')(opts)
}
