var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'whoami',
  command: whoami,
  options: [
    {
      name: 'config',
      boolean: false,
      default: '.datrc'
    }
  ]
}

function whoami (opts) {
  var client = TownshipClient({
    server: opts.server,
    config: {
      filename: opts.config
    }
  })
  var login = client.getLogin()
  if (!login) return ui.exitErr('Not logged in.')
  process.stdout.write(login.email)
  process.exit()
}
