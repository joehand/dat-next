var fs = require('fs')
var datKeyAs = require('dat-key-as')
var path = require('path')

module.exports = {
  read: function (dat, cb) {
    // dat.json
    // reads to dat.meta if exists
    // creates dat.json if not exists with title = dir name
    // (TODO: move to module & validate dat.json)
    fs.readFile(datJsonFile(dat), 'utf8', function (err, body) {
      if (err) return cb(err)
      var meta
      try {
        meta = JSON.parse(body)
      } catch (e) {
        return cb(new Error('Error reading the dat.json file.'))
      }
      cb(null, meta)
    })
  },
  create: function (dat, defaults, cb) {
    if (!defaults) defaults = {}
    dat.meta = {
      title: defaults.title || path.basename(dat.path),
      url: defaults.url || 'dat://' + dat.key.toString('hex'),
      name: defaults.name,
      description: defaults.description || ''
    }
    if (dat.key) dat.meta.url = 'dat://' + datKeyAs.str(dat.key)
    fs.writeFile(datJsonFile(dat), JSON.stringify(dat.meta), cb)
  }
}

function datJsonFile (dat) {
  return path.join(dat.path, 'dat.json')
}
