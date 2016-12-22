var fs = require('fs')
var nets = require('nets')
var stringKey = require('dat-encoding').toStr
var exit = require('../ui').exitErr
var download = require('../download')
var Debug = require('../debug')

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
  var debug = Debug(opts)

  opts.key = opts._[0]
  if (!opts.key) return exit('key required to clone')

  // Force these options for clone command
  opts.resume = false
  opts.exit = true

  try {
    // validates + removes dat://
    opts.key = stringKey(opts.key)
    createDir(opts.key, run)
  } catch (e) {
    var re = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/ // match username/dataset
    if (re.test(opts.key.trim())) return lookup()
    if (e.message.indexOf('Invalid key') === -1) return exit(e)
    return exit('Link is not a valid Dat link.')
  }

  function lookup () {
    debug('Registry lookup for:', opts.key)
    var archiveName = opts.key
    var registryUrl = opts.server.match(/\/$/) ? opts.server : opts.server + '/'
    registryUrl += archiveName

    nets({ url: registryUrl }, function (err, resp, body) {
      if (err) return exit(err)
      if (resp.statusCode !== 200) return exit('Dat archive not found on registry.')

      try {
        opts.key = stringKey(JSON.parse(body).url)
        debug('Received key from registry:', opts.key)
        if (opts.key) return createDir(archiveName, run)
      } catch (e) { }
      exit('Error getting key from registry')
    })
  }

  function run () {
    download('clone', opts)
  }

  function createDir (dir, cb) {
    debug('Creating directory for clone', dir)
    // Create the directory if it doesn't exist
    // If no dir is specified, we put dat in a dir with name = key
    opts.dir = opts._[1] || opts.dir
    if (!opts.dir || opts.dir === process.cwd()) { // Don't allow download to cwd for now
      opts.dir = dir.length === 64 ? dir : dir.split('/')[1] // use dataset name if using registry shortname
    }
    try {
      fs.accessSync(opts.dir, fs.F_OK)
    } catch (e) { fs.mkdirSync(opts.dir) }
    cb()
  }
}
