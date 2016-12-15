var fs = require('fs')
var stringKey = require('dat-key-as').string
var exit = require('../ui').exitErr
var download = require('../download')
var share = require('../share')

module.exports = {
  name: 'clone',
  command: clone,
  options: [
    {
      name: 'temp',
      boolean: true,
      default: false
    }
  ]
}

function clone (opts) {
  opts.key = opts._[0]
  if (!opts.key) return exit('key required to clone')
  var keys = opts.key.split('.')
  if (keys[1]) {
    opts.key = keys[0]
    opts.secretKey = new Buffer(keys[1], 'hex')
  }

  // Force these options for clone command
  opts.resume = false
  opts.exit = true

  // Create the directory if it doesn't exist
  // If no dir is specified, we put dat in a dir with name = key
  opts.key = opts.key.replace(/\/$/, '') // dat-encoding PR #13
  opts.key = stringKey(opts.key) // removes dat://
  opts.dir = opts._[1] || opts.dir
  if (!opts.dir || opts.dir === process.cwd()) opts.dir = opts.key // Don't allow download to cwd for now
  try {
    fs.accessSync(opts.dir, fs.F_OK)
  } catch (e) { fs.mkdirSync(opts.dir) }
  if (opts.secretKey) share('sync', opts)
  else download('clone', opts)
}
