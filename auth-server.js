var authServer = require('./auth-server')

// Useful for testing auth stuff for development!
// npm run auth-server

authServer(8080, function (server) {
  console.log('auth server running on http://localhost:8080')
})
