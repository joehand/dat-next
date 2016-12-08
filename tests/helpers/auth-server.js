var memdb = require('memdb')
var http = require('http')
var createAppa = require('appa')
var township = require('township')

module.exports = createServer

function createServer (port, cb) {
  var app = createAppa({log: {level: 'silent'}})
  var db = memdb()
  var ship = township({secret: 'test'}, db)

  app.on('/register', function (req, res, ctx) {
    // appa provides `ctx` for us in the way we want out of the box
    ship.register(req, res, ctx, function (err, code, data) {
      if (err) return app.error(res, code, err.message)
      app.send(res, code, data)
    })
  })

  app.on('/login', function (req, res, ctx) {
    // appa provides `ctx` for us in the way we want out of the box
    ship.login(req, res, ctx, function (err, code, data) {
      if (err) return app.error(res, code, err.message)
      app.send(res, code, data)
    })
  })

  var server = http.createServer(app)
  server.listen(port, function () {
    cb(server)
  })
}
