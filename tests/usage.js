var path = require('path')
var test = require('tape')
var spawn = require('./helpers/spawn.js')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))
var version = require('../package.json').version

test('misc - prints usage', function (t) {
  var d = spawn(t, dat)
  d.stderr.match(function (output) {
    var usage = output.indexOf('Usage') > -1
    if (!usage) return false
    return true
  })
  d.end()
})

test('misc - prints version', function (t) {
  var d = spawn(t, dat + ' -v')
  d.stderr.match(function (output) {
    var ver = output.indexOf(version) > -1
    if (!ver) return false
    return true
  })
  d.end()
})

test('misc - also prints version', function (t) {
  var d = spawn(t, dat + ' -v')
  d.stderr.match(function (output) {
    var ver = output.indexOf(version) > -1
    if (!ver) return false
    return true
  })
  d.end()
})
