var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'logout',
  command: logout,
  options: []
}

function logout (opts) {
  var client = TownshipClient({server: opts.server})

  client.getConfig(function (err, config) {
    if (err) ui.exitErr(err)
    var login = config.currentLogin
    if (!login) {
      process.stdout.write('Not logged in.')
      ui.exit()
    } else {
      client.logout(function (err) {
        if (err) ui.exitErr(err)
        process.stdout.write('Logged out.')
        ui.exit()
      })
    }
  })
}
