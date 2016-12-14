var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'login',
  command: login,
  options: []
}

function login (opts) {
  var email = opts.email
  if (!email) ui.exitErr('Email is required.')
  var password = opts.password
  if (!password) ui.exitErr('Password is required.')

  var client = TownshipClient(opts)

  client.login({
    email: email,
    password: password
  }, function (err) {
    if (err) ui.exitErr(err)
    console.log('Logged in successfully.')
    process.exit(0)
  })
}
