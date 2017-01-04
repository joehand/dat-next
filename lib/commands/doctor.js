var doctor = require('dat-doctor')

module.exports = {
  name: 'doctor',
  options: [],
  command: function (opts) {
    opts.id = opts._[0]
    doctor(opts)
  }
}
