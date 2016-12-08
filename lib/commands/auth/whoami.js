var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'whoami',
  command: whoami,
  options: []
}

function whoami (opts) {
  var client = TownshipClient({server: opts.server})

  client.getConfig(function (err, config) {
    if (err) ui.exitErr(err)
    var login = config.currentLogin
    if (!login) process.stdout.write('Not logged in.')
    else process.stdout.write(login.email)
    ui.exit()
  })
}
