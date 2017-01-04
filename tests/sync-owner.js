var fs = require('fs')
var net = require('net')
var path = require('path')
var test = require('tape')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var Dat = require('dat-node')
var spawn = require('./helpers/spawn.js')
var help = require('./helpers')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var fixtures = path.join(__dirname, 'fixtures')
var downDat

// os x adds this if you view the fixtures in finder and breaks the file count assertions
try { fs.unlinkSync(path.join(fixtures, '.DS_Store')) } catch (e) { /* ignore error */ }

test('sync-owner - errors without create first', function (t) {
  rimraf.sync(path.join(fixtures, '.dat'))
  // cmd: dat sync
  var cmd = dat + ' sync'
  var st = spawn(t, cmd, {cwd: fixtures})

  st.stderr.match(function (output) {
    var hasError = output.indexOf('No existing archive') > -1
    t.ok(hasError, 'emits error')
    st.kill()
    return true
  })
  st.end()
})

test('sync-owner - create a dat for syncing', function (t) {
  rimraf.sync(path.join(fixtures, '.dat'))
  // cmd: dat create
  var cmd = dat + ' create'
  var st = spawn(t, cmd, {cwd: fixtures})
  st.stdout.match(function (output) {
    var importFinished = output.indexOf('import finished') > -1
    if (!importFinished) return false
    st.kill()
    return true
  })
  st.stderr.empty()
  st.end()
})

test('sync-owner - default opts', function (t) {
  // cmd: dat sync
  var cmd = dat + ' sync'
  var st = spawn(t, cmd, {cwd: fixtures, end: false})

  var key

  st.stdout.match(function (output) {
    var sharing = output.indexOf('Dat Network') > -1
    if (!sharing) return false

    key = help.matchLink(output)

    t.ok(key, 'prints link')
    t.ok(output.indexOf('tests/fixtures') > -1, 'prints dir')

    downloadDat()
    return true
  })
  st.stderr.empty()
  st.end()

  function downloadDat () {
    var downloadDir = path.join(help.testFolder(), '' + Date.now())
    mkdirp.sync(downloadDir)

    Dat(downloadDir, { key: key }, function (err, tmpDat) {
      if (err) throw err

      downDat = tmpDat
      downDat.joinNetwork()

      downDat.network.swarm.once('connection', function () {
        t.pass('downloader connects')
        downDat.close(function () {
          rimraf.sync(downDat.path)
          t.end()
        })
      })
    })
  }
})

test('sync-owner - create without import for syncing', function (t) {
  rimraf.sync(path.join(fixtures, '.dat'))
  // cmd: dat create
  var cmd = dat + ' create --no-import'
  var st = spawn(t, cmd, {cwd: fixtures})
  st.stdout.match(function (output) {
    if (output.indexOf('Archive initialized') > -1) return true
    return false
  })
  st.succeeds()
  st.end()
})

test('sync-owner - imports after no-import create', function (t) {
  // cmd: dat sync
  var cmd = dat + ' sync'
  var st = spawn(t, cmd, {cwd: fixtures})

  st.stdout.match(function (output) {
    var sharing = output.indexOf('Sharing latest') > -1
    if (!sharing) return false

    var fileRe = new RegExp('3 files')
    var bytesRe = new RegExp(/1\.\d{1,2} kB/)

    t.ok(help.matchLink(output), 'prints link')
    t.ok(output.indexOf('tests/fixtures') > -1, 'prints dir')
    t.ok(output.match(fileRe), 'total size: files okay')
    t.ok(output.match(bytesRe), 'total size: bytes okay')

    st.kill()
    return true
  })
  st.stderr.empty()
  st.end()
})

test('sync-owner - port and utp options', function (t) {
  var port = 3281
  var cmd = dat + ' sync --port ' + port + ' --no-utp'
  var st = spawn(t, cmd, {cwd: fixtures, end: false})
  st.stderr.empty()

  var server = net.createServer()
  server.once('error', function (err) {
    if (err.code !== 'EADDRINUSE') return t.error(err)
    t.skip('TODO: correct port in use')
    done()
  })
  server.once('listening', function () {
    t.skip(`TODO: port ${server.address().port} should be in use`)
    done()
  })
  server.listen(port)

  t.skip('TODO: check utp option') // TODO: how to check utp?

  function done () {
    server.close(function () {
      st.kill()
      t.end()
    })
  }
})

test('sync-owner - shorthand', function (t) {
  var cmd = dat + ' .'
  var st = spawn(t, cmd, {cwd: fixtures})

  st.stdout.match(function (output) {
    var sharing = output.indexOf('Sharing latest') > -1
    if (!sharing) return false

    t.ok(help.matchLink(output), 'prints link')

    st.kill()
    return true
  })
  st.stderr.empty()
  st.end()
})

test.onFinish(function () {
  rimraf.sync(path.join(fixtures, '.dat'))
})
