#!/usr/bin/env node

var path = require('path')
var minimist = require('minimist')
var pretty = require('prettier-bytes')
var speed = require('speedometer')
var progress = require('progress-string')
var cliTruncate = require('cli-truncate')
var neatLog = require('neat-log')
var mirror = require('mirror-folder')
var debug = require('debug')('dat-next')
var view = require('./ui')

var Dat = require('./')

process.title = 'dat-next'

var argv = minimist(process.argv.slice(2), {
  alias: {temp: 't', help: 'h', watch: 'w', sleep: 's'},
  boolean: ['watch'],
  default: {
    'watch' : true
  }
})

var src = argv._[0] || process.cwd()
var dest = argv._[1]
var logspeed = argv.logspeed || 400
var quiet = debug.enabled || !!process.env.DEBUG

if (!argv._.length || argv.help) return usage()

var neat = neatLog([view.main, view.network], {
  logspeed: logspeed,
  quiet: quiet
})
neat.use(runDat)
neat.use(trackNetwork)

function runDat (state, bus) {
  state.opts = argv
  state.title = 'Starting Dat program...'
  bus.emit('render')

  Dat(src, dest, argv, function (err, dat) {
    if (err) {
      console.error('ERROR:', err)
      process.exit(1)
    }
    state.title = 'Running Dat'

    state.archive = dat.archive
    // state.stats = dat.trackStats()
    state.network = dat.joinNetwork()
    bus.emit('network')

    if (dat.owner) share()
    else {
      state.network.once('connection', function () {
        console.log('connected to peer!')
        download()
      })
    }

    function download () {
      console.log(`Downloading: ${dat.key.toString('hex')}`)
      console.log('to:', path.resolve(dest), '\n')
      var progress = mirror({fs: dat.archive, name: '/'}, dest, function (err) {
        if (err) throw err
        console.log('Done')
      })
      progress.on('put', function (src) {
        console.log('Downloading', src.name)
      })
    }

    function share () {
      // console.log('Sharing', path.resolve(src))

      var progress = dat.importFiles(src, {
        ignore: ['node_modules', '.dat']
      }, function (err) {
        if (err) throw err
        console.log('Done importing')
      })
      var importSpeed = speed()
      progress.on('put-data', function (chunk, src, dst) {
        state.importSpeed = importSpeed(chunk.length)
        bus.emit('render')
      })
      progress.on('put', function (src, dest) {
        // console.log('Added', dest.name)
      })

      // console.log(`KEY: ${dat.key.toString('hex')}\n`)
    }
  })
}

function trackNetwork (state, bus) {
  bus.on('network', function () {
    var network = state.network

    network.on('connection', function (peer) {
      bus.emit('render')
      peer.on('close', function () {
        bus.emit('render')
      })
    })

    // var speed = state.stats.network

    // setInterval(function () {
    //   state.uploadSpeed = speed.uploadSpeed
    //   state.downloadSpeed = speed.downloadSpeed
    //   bus.emit('render')
    // }, logspeed)
  })
}

function usage () {
  console.error('dat-next!')
  console.error('  dat-next <dir>         SHARE directory')
  console.error('  dat-next <key> <dir>   DOWNLOAD key to dir (directory required)')
  process.exit(0)
}
