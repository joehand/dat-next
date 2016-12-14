var Dat = require('dat-node')
var TownshipClient = require('../township')
var ui = require('../ui')

module.exports = {
  name: 'publish',
  options: [],
  command: publish
}

function publish (opts) {
  var client = TownshipClient({
    server: opts.server,
    config: {
      filepath: opts.config
    }
  })
  if (!client.getLogin().token) return ui.exitErr('Please login before publishing.')

  opts.resume = true // publish must always be a resumed archive
  Dat(opts.dir, opts, function (err, dat) {
    if (err && err.indexOf('No existing archive') === -1) return ui.exitErr(err)
    else if (err) return ui.exitErr('Please create an archive before publishing.')

    if (!dat.meta.name) {
      // TODO: prompt for name
      console.error('Set a name in dat.json')
      process.exit(1)
    }

    var datInfo = {
      name: dat.meta.name,
      url: 'dat://' + dat.key.toString('hex'),
      title: dat.meta.title,
      description: dat.meta.description,
      keywords:  dat.meta.keywords
    }

    client.secureRequest({
      method: 'POST', url: '/api/v1/dats', body: datInfo, json: true
    }, function (err, resp, body) {
      if (err) return ui.exitErr(err)
      console.log('Successfully published!')
      process.exit(0)
    })
  })
}
