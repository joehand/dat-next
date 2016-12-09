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
  var config = client.config.get()
  var login = config.currentLogin
  if (!login) process.stdout.write('Not logged in.')
  else process.stdout.write(login.email)
  ui.exit()
}
