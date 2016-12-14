var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'logout',
  command: logout,
  options: [
    {
      name: 'config',
      boolean: false,
      default: '.datrc'
    }
  ]
}

function logout (opts) {
  var client = TownshipClient({
    server: opts.server,
    config: {
      filename: opts.config
    }
  })

  if (!client.getLogin()) return ui.exitErr('Not logged in.')
  client.logout(function (err) {
    if (err) ui.exitErr(err)
    process.stdout.write('Logged out.')
    process.exit(0)
  })
}
