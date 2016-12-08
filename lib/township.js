var xtend = require('xtend')
var TownshipClient = require('township-client')
var fs = require('fs')
var homedir = require('homedir')
var path = require('path')

module.exports = function (opts) {
  var defaults = {
    server: 'https://auth.dat.land',
    config: {
      filename: '.datrc'
    }
  }
  var options = xtend(defaults, opts)
  var client = TownshipClient(options)
  var configPath = path.join(homedir(), options.config.filename)

  client.getConfig = function (cb) {
    fs.readFile(configPath, function (err, contents) {
      cb(err, JSON.parse(contents.toString()))
    })
  }

  client.logout = function (cb) {
    client.getConfig(function (err, config) {
      if (err) return cb(err)
      config.currentLogin = ''
      fs.writeFile(configPath, JSON.stringify(config, null, 2), cb)
    })
  }
  return client
}
