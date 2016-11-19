var fs = require('fs')
var exit = require('../ui').exitErr
var download = require('../lib/download')

module.exports = function (opts) {
  opts.key = opts._[0]
  if (!opts.key) return exit('key required to clone')

  // Force these options for clone command
  opts.resume = false
  opts.exit = true

  // Create the directory if it doesn't exist
  // If no dir is specified, we put dat in a dir with name = key
  opts.dir = opts._[1] || opts.dir
  if (!opts.dir || opts.dir === process.cwd()) opts.dir = opts.key // Don't allow download to cwd for now
  try {
    fs.accessSync(opts.dir, fs.F_OK)
  } catch (e) { fs.mkdirSync(opts.dir) }
  download('clone', opts)
}
