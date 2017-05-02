#!/usr/bin/env node

var minimist = require('minimist')
var pretty = require('prettier-bytes')
var speed = require('speedometer')
var progress = require('progress-string')
var cliTruncate = require('cli-truncate')
var neatLog = require('neat-log')
var output = require('neat-log/output')
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

if (argv.help) return usage()

var src = argv._[0] || process.cwd()
var dest = argv._[1]
var logspeed = argv.logspeed || 400
var quiet = debug.enabled || !!process.env.DEBUG


var neat = neatLog([view.main, view.progress], {
  logspeed: logspeed,
  quiet: quiet
})
neat.use(runDat)
neat.use(trackNetwork)
neat.use(trackProgress)

function runDat (state, bus) {
  state.opts = argv
  state.title = 'Starting Dat program...'
  bus.emit('render')

  Dat(src, dest, argv, function (err, dat) {
    if (err) {
      bus.clear()
      console.error('ERROR:', err)
      process.exit(1)
    }
    state.archive = dat.archive
    state.network = dat.network
    state.importer = dat.importer
    state.stats = dat.stats
    state.writable = dat.writable
    if (dat.archive.content) {
      bus.emit('archive:content')
    } else {
      dat.archive.once('content', function () {
        bus.emit('archive:content')
      })
    }
    dat.archive.metadata.on('append', function () {
      bus.emit('render')
    })

    if (dat.writable) state.title = `dat://${dat.key.toString('hex')}`
    else state.title = 'Dat!'

    bus.emit('archive')
    bus.emit('render')
  })
}

function trackProgress (state, bus) {
  bus.once('archive:content', function () {
    if (state.archive.metadata.writable) trackImport()
    else trackDownload()
  })

  function trackDownload () {
    state.downloading = true
    state.modified = false

    state.archive.content.on('clear', function () {
      state.modified = true
    })

    state.archive.content.on('download', function (index, data) {
      state.modified = true
    })

    state.archive.on('sync', function () {
      state.nsync = true
      if (state.modified && !argv.live) {
        state.downloadExit = true
        bus.render()
        process.exit()
      }
      bus.emit('render')
    })

    state.archive.on('update', function () {
      state.nsync = false
      bus.emit('render')
      bus.emit('archive:update')
    })
  }

  function trackImport () {
    state.importing = true
    var progress = state.importer
    var counting = setInterval(function () {
      // Update file count while we are going (for big dirs)
      bus.emit('render')
    }, logspeed)

    progress.once('count', function (count) {
      clearInterval(counting)
      state.count = count
      bus.emit('render')
    })

    progress.on('put', function (src, dst) {
      if (src.stat.isDirectory()) return
      state.fileImport = {
        src: src,
        dst: dst,
        progress: 0,
        type: 'put'
      }
      bus.emit('render')
    })

    progress.on('put-data', function (chunk, src, dst) {
      state.fileImport.progress += chunk.length
      bus.emit('render')
    })

    progress.on('put-end', function (src, dst) {
      // state.fileImport = null
      bus.emit('render')
    })

    progress.on('end', function (src, dst) {
      // state.fileImport = null
      bus.emit('render')
    })
  }
}

function trackNetwork (state, bus) {
  bus.on('archive:content', function () {
    var network = state.network

    network.on('connection', function (peer) {
      bus.emit('render')
      peer.on('close', function () {
        bus.emit('render')
      })
    })

    var speed = state.stats.network

    setInterval(function () {
      state.uploadSpeed = speed.uploadSpeed
      state.downloadSpeed = speed.downloadSpeed
      bus.emit('render')
    }, logspeed)
  })
}


function usage () {
  console.error('dat-next!')
  console.error('  dat-next <dir>         SHARE directory')
  console.error('  dat-next <key> <dir>   DOWNLOAD key to dir (directory required)')
  process.exit(0)
}
