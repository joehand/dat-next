var path = require('path')
var test = require('tape')
var spawn = require('./helpers/spawn.js')
var help = require('./helpers')

var dat = path.resolve(path.join(__dirname, '..', 'bin', 'cli.js'))

test('misc - doctor option works ', function (t) {
  var st = spawn(t, dat + ' doctor', {end: false})
  st.stdout.match(function (output) {
    var key = help.matchLink(output)
    if (!key) return false
    startPhysiciansAssistant(key)
    return true
  }, 'doctor started')

  function startPhysiciansAssistant (link) {
    var assist = spawn(t, dat + ' doctor ' + link, {end: false})
    assist.stdout.match(function (output) {
      if (output.indexOf('Public IP:') > -1) {
        st.kill()
        return true
      }
    }, 'download one started')
    assist.end(function () {
      t.end()
    })
  }
})
