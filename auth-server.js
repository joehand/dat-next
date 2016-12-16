var path = require('path')
var Server = require('dat.land/server')
var initDb = require('dat.land/server/database/init')
var rimraf = require('rimraf')

var config = {
  township: {
    secret: 'very secret code',
    db: path.join(__dirname, 'test-township.db')
  },
  db: {
    dialect: 'sqlite3',
    connection: { filename: path.join(__dirname, 'test-sqlite.db') },
    useNullAsDefault: true
  },
  whitelist: false,
  port: process.env.PORT || 8888
}

initDb(config.db, function (err, db) {
  if (err) throw err
  const server = Server(config, db)
  server.listen(config.port, function () {
    console.log('listening', config.port)
  })

  process.on('exit', close)
  process.on('SIGINT', close)

  function close (cb) {
    server.close(function () {
      rimraf.sync(config.township.db)
      rimraf.sync(config.db.connection.filename)
      process.exit()
    })
  }
})
