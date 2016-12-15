var test = require('tape')
var path = require('path')
var fs = require('fs')
var spawn = require('./helpers/spawn')
var help = require('./helpers')
var authServer = require('./helpers/auth-server')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var baseTestDir = help.testFolder()

var port = process.env.PORT || 3000
var SERVER = 'http://localhost:' + port
var config = path.join(__dirname, '.datrc-test')
var opts = ' --server=' + SERVER + ' --config=' + config

dat += opts

authServer(port, function (server) {
  test('auth - whoami works when not logged in', function (t) {
    var cmd = dat + ' whoami '
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.same('Not logged in.', output.trim(), 'printed correct output')
      return true
    })
    st.stdout.empty()
    st.end()
  })

  test('auth - register works', function (t) {
    var cmd = dat + ' register --email=hello@bob.com --password=joe --username=joe'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same(output.trim(), 'Registered successfully.', 'output success message')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - login works', function (t) {
    var cmd = dat + ' login --email=hello@bob.com --password=joe'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same(output.trim(), 'Logged in successfully.', 'output success message')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - whoami works', function (t) {
    var cmd = dat + ' whoami'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('hello@bob.com', output.trim(), 'email printed')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - logout works', function (t) {
    var cmd = dat + ' logout'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('Logged out.', output.trim(), 'output correct')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - logout prints correctly when trying to log out twice', function (t) {
    var cmd = dat + ' logout'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.same('Not logged in.', output.trim(), 'output correct')
      return true
    })
    st.stdout.empty()
    st.end()
  })

  test('auth - whoami works after logging out', function (t) {
    var cmd = dat + ' whoami'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.same('Not logged in.', output.trim())
      return true
    })
    st.stdout.empty()
    st.end()
  })

  test.onFinish(function () {
    server.close(function () {
      fs.unlink(config, function () {
        // done!
      })
    })
  })
})
