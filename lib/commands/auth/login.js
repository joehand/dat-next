var prompt = require('prompt')
var ui = require('../../ui')
var TownshipClient = require('../../township')

module.exports = {
  name: 'login',
  command: login,
  options: []
}

function login (opts) {
  if (opts.email && opts.password) return makeRequest(opts)

  prompt.message = ''
  prompt.colors = false
  prompt.start()
  prompt.get([{
    name: 'email',
    description: 'Email Address',
    required: true
  },
  {
    name: 'password',
    description: 'Password',
    required: true,
    hidden: true,
    replace: '*'
  }], function (err, results) {
    if (err) return console.log(err.message)
    makeRequest(results)
  })

  function makeRequest (user) {
    var client = TownshipClient(opts)

    client.login({
      email: user.email,
      password: user.password
    }, function (err) {
      if (err) ui.exitErr(err)
      console.log('Logged in successfully.')
      process.exit(0)
    })
  }
}
