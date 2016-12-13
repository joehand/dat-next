var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var spawn = require('./helpers/spawn.js')
var help = require('./helpers')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var baseTestDir = help.testFolder()
var shareDat

test('clone - default opts', function (t) {
  // cmd: dat clone <link>
  help.shareFixtures(function (_, fixturesDat) {
    shareDat = fixturesDat
    var key = shareDat.key.toString('hex')
    var cmd = dat + ' clone ' + key
    var st = spawn(t, cmd, {cwd: baseTestDir})
    var datDir = path.join(baseTestDir, key)
    st.stdout.match(function (output) {
      var downloadFinished = output.indexOf('Download Finished') > -1
      if (!downloadFinished) return false

      var stats = shareDat.stats.get()
      var fileRe = new RegExp(stats.filesTotal + ' files')
      var bytesRe = new RegExp(/1\.\d{1,2} kB/)

      t.ok(help.matchLink(output), 'prints link')
      t.ok(output.indexOf('dat-download-folder/' + key) > -1, 'prints dir')
      t.ok(output.match(fileRe), 'total size: files okay')
      t.ok(output.match(bytesRe), 'total size: bytes okay')
      t.ok(help.isDir(datDir), 'creates download directory')

      var fileList = help.fileList(datDir).join(' ')
      var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
      t.ok(hasCsvFile, 'csv file downloaded')
      var hasDatFolder = fileList.indexOf('.dat') > -1
      t.ok(hasDatFolder, '.dat folder created')
      var hasSubDir = fileList.indexOf('folder') > -1
      t.ok(hasSubDir, 'folder created')
      var hasNestedDir = fileList.indexOf('nested') > -1
      t.ok(hasNestedDir, 'nested folder created')
      var hasHelloFile = fileList.indexOf('hello.txt') > -1
      t.ok(hasHelloFile, 'hello.txt file downloaded')

      st.kill()
      return true
    })
    st.succeeds('exits after finishing download')
    st.stderr.empty()
    st.end()
  })
})

test('clone - errors on existing dir', function (t) {
  // cmd: dat clone <link> (same thing again as above)
  var key = shareDat.key.toString('hex')
  var cmd = dat + ' clone ' + key
  var st = spawn(t, cmd, {cwd: baseTestDir})
  st.stderr.match(function (output) {
    t.ok('cannot overwrite', 'Error saying you cannot overwrite')
    st.kill()
    return true
  })
  st.stdout.empty()
  st.end()
})

test('clone - specify dir', function (t) {
  // cmd: dat clone <link> my_dir
  var key = shareDat.key.toString('hex')
  var customDir = 'my_dir'
  var cmd = dat + ' clone ' + key + ' ' + customDir
  var st = spawn(t, cmd, {cwd: baseTestDir})
  st.stdout.match(function (output) {
    var downloadFinished = output.indexOf('Download Finished') > -1
    if (!downloadFinished) return false

    t.ok(output.indexOf('dat-download-folder/' + customDir) > -1, 'prints dir')
    t.ok(help.isDir(path.join(baseTestDir, customDir)), 'creates download directory')

    st.kill()
    return true
  })
  st.succeeds('exits after finishing download')
  st.stderr.empty()
  st.end()
})

test('clone - quiet', function (t) {
  var key = shareDat.key.toString('hex')
  var customDir = 'shhhh_dir'
  var cmd = dat + ' clone ' + key + ' ' + customDir + ' --quiet'
  var st = spawn(t, cmd, {cwd: baseTestDir})
  st.succeeds('exits after finishing download')
  st.stdout.empty()
  st.stderr.empty()
  st.end()
})

test('clone - dat:// link', function (t) {
  var key = 'dat://' + shareDat.key.toString('hex') + '/'
  var baseDir = path.join(baseTestDir, 'dat_proto_dir')
  mkdirp.sync(baseDir)
  var downloadDir = path.join(baseDir, shareDat.key.toString('hex'))
  var cmd = dat + ' clone ' + key
  var st = spawn(t, cmd, {cwd: baseDir})
  st.succeeds('exits after finishing download')
  st.stdout.match(function (output) {
    var downloadFinished = output.indexOf('Download Finished') > -1
    if (!downloadFinished) return false

    t.ok(output.indexOf(downloadDir) > -1, 'prints dir')
    t.ok(help.isDir(downloadDir, 'creates download directory'))

    st.kill()
    return true
  })
  st.stderr.empty()
  st.end(function () {
    rimraf.sync(downloadDir)
  })
})

test('clone - dat.land link', function (t) {
  var key = 'dat.land/' + shareDat.key.toString('hex') + '/'
  var baseDir = path.join(baseTestDir, 'dat_land_dir')
  mkdirp.sync(baseDir)
  var downloadDir = path.join(baseDir, shareDat.key.toString('hex'))
  var cmd = dat + ' clone ' + key
  var st = spawn(t, cmd, {cwd: baseDir})
  st.succeeds('exits after finishing download')
  st.stdout.match(function (output) {
    var downloadFinished = output.indexOf('Download Finished') > -1
    if (!downloadFinished) return false

    t.ok(output.indexOf(downloadDir) > -1, 'prints dir')
    t.ok(help.isDir(downloadDir, 'creates download directory'))

    st.kill()
    return true
  })
  st.stderr.empty()
  st.end(function () {
    rimraf.sync(downloadDir)
  })
})

test('close sharer', function (t) {
  shareDat.close(function () {
    rimraf.sync(path.join(shareDat.path, '.dat'))
    t.end()
  })
})

test('clone - with --temp', function (t) {
  // cmd: dat clone <link>
  help.shareFixtures(function (_, fixturesDat) {
    shareDat = fixturesDat
    var key = shareDat.key.toString('hex')
    var cmd = dat + ' clone ' + key + ' --temp'
    var st = spawn(t, cmd, {cwd: baseTestDir})
    var datDir = path.join(baseTestDir, key)
    st.stdout.match(function (output) {
      var downloadFinished = output.indexOf('Download Finished') > -1
      if (!downloadFinished) return false

      var stats = shareDat.stats.get()
      var fileRe = new RegExp(stats.filesTotal + ' files')
      var bytesRe = new RegExp(/1\.\d{1,2} kB/)

      t.ok(help.matchLink(output), 'prints link')
      t.ok(output.indexOf('dat-download-folder/' + key) > -1, 'prints dir')
      t.ok(output.match(fileRe), 'total size: files okay')
      t.ok(output.match(bytesRe), 'total size: bytes okay')
      t.ok(help.isDir(datDir), 'creates download directory')

      var fileList = help.fileList(datDir).join(' ')
      var hasCsvFile = fileList.indexOf('all_hour.csv') > -1
      t.ok(hasCsvFile, 'csv file downloaded')
      var hasDatFolder = fileList.indexOf('.dat') > -1
      t.ok(!hasDatFolder, '.dat folder not created')
      var hasSubDir = fileList.indexOf('folder') > -1
      t.ok(hasSubDir, 'folder created')
      var hasNestedDir = fileList.indexOf('nested') > -1
      t.ok(hasNestedDir, 'nested folder created')
      var hasHelloFile = fileList.indexOf('hello.txt') > -1
      t.ok(hasHelloFile, 'hello.txt file downloaded')

      st.kill()
      return true
    })
    st.succeeds('exits after finishing download')
    st.stderr.empty()
    st.end()
  })
})

test('clone - hypercore link', function (t) {
  help.shareFeed(function (_, key, close) {
    var cmd = dat + ' clone ' + key
    var st = spawn(t, cmd, {cwd: baseTestDir})
    var datDir = path.join(baseTestDir, key)
    st.stderr.match(function (output) {
      var error = output.indexOf('not a Dat Archive') > -1
      if (!error) return false
      t.ok(error, 'has error')
      t.ok(!help.isDir(datDir), 'download dir removed')
      st.kill()
      return true
    })
    st.fails('Does not download')
    st.end(function () {
      close()
    })
  })
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
