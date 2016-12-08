var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'register',
  command: register,
  options: []
}

function register (opts) {
  var email = opts.email
  if (!email) ui.exitErr(new Error('Email is required.'))
  var password = opts.password
  if (!password) ui.exitErr(new Error('Password is required.'))

  var client = TownshipClient({server: opts.server})

  client.register({
    email: email,
    password: password
  }, function (err) {
    if (err) ui.exitErr(err)
    process.stdout.write('Registered successfully.')
    ui.exit()
  })
}
