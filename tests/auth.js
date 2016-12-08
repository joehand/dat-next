var test = require('tape')
var path = require('path')
var spawn = require('./helpers/spawn')
var help = require('./helpers')
var authServer = require('./helpers/auth-server')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var baseTestDir = help.testFolder()

var port = process.env.PORT || 3000
var SERVER = 'http://localhost:' + port

authServer(port, function (server) {
  test('auth - whoami works when not logged in', function (t) {
    var cmd = dat + ' whoami --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('Not logged in.', output, 'printed correct output')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - register requires email', function (t) {
    var cmd = dat + ' register --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.ok(output.indexOf('Email is required') > -1, 'outputs correct error message')
      st.kill()
      return true
    })
    st.stdout.empty()
    st.fails()
    st.end()
  })

  test('auth - register requires email and password', function (t) {
    var cmd = dat + ' register --email=hello@bob.com --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.ok(output.indexOf('Password is required') > -1, 'outputs correct error message')
      st.kill()
      return true
    })
    st.stdout.empty()
    st.fails()
    st.end()
  })

  test('auth - register works', function (t) {
    var cmd = dat + ' register --email=hello@bob.com --password=joe --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same(output.trim(), 'Registered successfully.', 'output success message')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - login requires email', function (t) {
    var cmd = dat + ' login --password=joe --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.ok(output.indexOf('Email is required') > -1, 'outputs correct error message')
      st.kill()
      return true
    })
    st.stdout.empty()
    st.end()
  })

  test('auth - login requires email and password', function (t) {
    var cmd = dat + ' login --email=hello@bob.com --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stderr.match(function (output) {
      t.ok(output.indexOf('Password is required') > -1, 'outputs correct error message')
      st.kill()
      return true
    })
    st.stdout.empty()
    st.end()
  })

  test('auth - login works', function (t) {
    var cmd = dat + ' login --email=hello@bob.com --password=joe --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same(output.trim(), 'Logged in successfully.', 'output success message')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - whoami works', function (t) {
    var cmd = dat + ' whoami --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('hello@bob.com', output, 'email printed')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - logout works', function (t) {
    var cmd = dat + ' logout'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('Logged out.', output, 'output correct')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - logout prints correctly when trying to log out twice', function (t) {
    var cmd = dat + ' logout'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('Not logged in.', output, 'output correct')
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test('auth - whoami works after logging out', function (t) {
    var cmd = dat + ' whoami --server=' + SERVER
    var st = spawn(t, cmd, {cwd: baseTestDir})
    st.stdout.match(function (output) {
      t.same('Not logged in.', output)
      return true
    })
    st.stderr.empty()
    st.end()
  })

  test.onFinish(function () {
    server.close()
  })
})
