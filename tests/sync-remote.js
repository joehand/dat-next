var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var spawn = require('./helpers/spawn.js')
var help = require('./helpers')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var baseTestDir = help.testFolder()
var shareDat

test('sync-remote - default opts', function (t) {
  // cmd: dat sync
  var key
  var datDir

  help.shareFixtures({import: false}, function (_, fixturesDat) {
    shareDat = fixturesDat
    key = shareDat.key.toString('hex')
    datDir = path.join(baseTestDir, key)

    makeClone(function () {
      shareDat.importFiles(function () {
        var cmd = dat + ' sync'
        var st = spawn(t, cmd, {cwd: datDir})
        st.stdout.match(function (output) {
          var updated = output.indexOf('Files updated') > -1
          if (!updated) return false

          var fileRe = new RegExp('3 files')
          var bytesRe = new RegExp(/1\.\d{1,2} kB/)

          key = help.matchLink(output)

          t.ok(key, 'prints link')
          t.ok(output.indexOf('dat-download-folder/' + key) > -1, 'prints dir')
          t.ok(output.match(fileRe), 'total size: files okay')
          t.ok(output.match(bytesRe), 'total size: bytes okay')

          st.kill()
          return true
        })
        st.stderr.empty()
        st.end()
      })
    })
  })

  function makeClone (cb) {
    var cmd = dat + ' clone ' + key
    var st = spawn(t, cmd, {cwd: baseTestDir, end: false})
    st.stdout.match(function (output) {
      var downloadFinished = output.indexOf('Download Finished') > -1
      if (!downloadFinished) return false

      st.kill()
      cb()
      return true
    })
    st.stderr.empty()
  }
})

test('close sharer', function (t) {
  shareDat.close(function () {
    rimraf.sync(path.join(shareDat.path, '.dat'))
    t.end()
  })
})

test.onFinish(function () {
  rimraf.sync(baseTestDir)
})
