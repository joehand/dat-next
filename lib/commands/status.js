var Dat = require('dat-node')
var ui = require('../ui')

module.exports = {
  name: 'status',
  options: [],
  command: function (opts) {
    // Force these options for status command
    opts.resume = true

    Dat(opts.dir, opts, function (err, dat) {
      if (err) return ui.exit(err)
      console.log('Metadata Blocks:', dat.archive.metadata.blocks)
      console.log('Content Blocks:', dat.archive.content.blocks)
    })
  }
}
