var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'login',
  command: login,
  options: [
    {
      name: 'config',
      boolean: false,
      default: '.datrc'
    }
  ]
}

function login (opts) {
  var email = opts.email
  if (!email) ui.exitErr(new Error('Email is required.'))
  var password = opts.password
  if (!password) ui.exitErr(new Error('Password is required.'))

  var client = TownshipClient({
    server: opts.server,
    config: {
      filename: opts.config
    }
  })

  client.login({
    email: email,
    password: password
  }, function (err) {
    if (err) ui.exitErr(err)
    process.stdout.write('Logged in successfully.')
    ui.exit()
  })
}
