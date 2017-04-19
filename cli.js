#!/usr/bin/env node

var minimist = require('minimist')
var pretty = require('prettier-bytes')
var speed = require('speedometer')
var progress = require('progress-string')
var cliTruncate = require('cli-truncate')
var neatLog = require('neat-log')
var output = require('neat-log/output')

var dat = require('./')

process.title = 'dat-next'

var argv = minimist(process.argv.slice(2), {
  alias: {temp: 't', quiet: 'q', watch: 'w', sleep: 's'}
})
var src = argv._[0] || process.cwd()
var dest = argv._[1]
var indexSpeed = speed()

var neat = neatLog([mainView, progressView], {logspeed: 200}) // todo: opts.debug
neat.use(runDat)
neat.use(trackNetwork)
neat.use(trackProgress)

function runDat (state, bus) {
  state.title = 'Starting Dat program...'
  bus.emit('render')

  dat(src, dest, argv, function (err, dat) {
    if (err) {
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
    else state.title = 'Dat Download'

    bus.emit('archive')
    bus.emit('render')
  })
}

function trackProgress (state, bus) {
  bus.on('archive:content', function () {
    if (state.archive.metadata.writable) trackImport()
    else trackDownload()
  })

  function trackDownload () {
    state.downloading = true
    state.archive.content.on('sync', function () {
      state.nsync = true
      bus.emit('render')
    })
  }

  function trackImport () {
    var progress = state.importer

    var counting = setInterval(function () {
      // Update file count while we are going (for big dirs)
      bus.emit('render')
    }, 200)

    state.importing = true
    state.import = {
      progress: state.archive.content.byteLength // ? is this what I want
    }

    progress.on('count', function (count) {
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
      state.import.progress += chunk.length
      indexSpeed(chunk.length)
      bus.emit('render')
    })

    progress.on('put-end', function (src, dst) {
      state.fileImport = null
      bus.emit('render')
    })

    progress.on('end', function (src, dst) {
      state.fileImport = null
      // state.importing = false
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
    }, 500)
  })
}

function mainView (state) {
  return output`
    ${state.title}
    ${archiveUI(state)}
    ${networkUI(state)}
  `
}

function progressView (state) {
  if (state.downloading) return downloadUI(state)
  else if (state.importer) return importUI(state)
  return ''
}

function archiveUI (state) {
  if (!state.archive) return `Starting...`
  var archive = state.archive
  var size = archive.content ? archive.content.byteLength : 0
  var files = archive.metadata.length - 1
  return output`
    ${state.downloading ? 'Downloading' : 'Syncing'} Archive: ${files} files (${pretty(size)})
  `
}

function networkUI (state) {
  if (!state.network) return ''
  if (!state.network.connected || !state.archive.content) {
    if (state.writable) return '\nWaiting for Connections...'
    return '\nConnecting...'
  }
  return output`

    ${state.archive.content.peers.length} peers
    ${speed()}
  `

  function speed () {
    var output = ''
    if (state.uploadSpeed) output += `Uploading ${pretty(state.uploadSpeed)}/s`
    if (state.downloadSpeed) output += `Downloading ${pretty(state.downloadSpeed)}/s`
    return output
  }
}

function downloadUI (state) {
  if (state.nsync) {
    return output`

      Archive up to date with latest.
      Exit if you'd like.
    `
  }
  if (!state.downloaded) {
    var feed = state.archive.content
    state.downloaded = 0
    for (var i = 0; i < feed.length; i++) {
      if (feed.has(i)) state.downloaded++
    }
    state.archive.content.on('download', function () {
      state.downloaded += 1
    })
  }
  if (!state.downloadBar) {
    var total = state.stats.get().blocksTotal
    state.downloadBar = progress({
      total: total,
      style: function (a, b) {
        return `[${a}${b}] ${(100 * state.downloaded / total).toFixed(2)}%`
      }
    })
  }
  return output`

    ${state.downloadBar(state.downloaded)}
  `
}

function importUI (state) {
  if (!state.count) return `\nStarting import of ${state.importer.count.files} files ... (${pretty(state.importer.count.bytes)})`
  if (state.import.progress === state.count.bytes) return '\nAll files imported.'
  if (!state.totalBar) {
    var total = state.count.bytes
    state.totalBar = progress({
      total: total,
      style: function (a, b) {
        return `[${a}${b}] ${pretty(state.import.progress)} / ${pretty(total)}`
      }
    })
  }

  return output`

    Importing ${state.count.files} files to Archive
    ${state.totalBar(state.import.progress)}
    ${pretty(indexSpeed())}/s
    ${fileImport()}
  `

  function fileImport () {
    if (!state.fileImport) return ``
    if (state.fileImport.type === 'del') return `\nDEL: ${state.fileImport.src.name}`
    if (!state.fileImport.bar) {
      var total = state.fileImport.src.stat.size
      state.fileImport.bar = progress({
        total: total,
        style: function (a, b) {
          return `[${a}${b}] ${pretty(state.fileImport.progress)} / ${pretty(total)}`
        }
      })
    }
    var name = state.fileImport.dst.name
    return output`

      ADD: ${cliTruncate(name, process.stdout.columns - 5, {position: 'start'})}
      ${state.fileImport.bar(state.fileImport.progress)}
    `
  }
}
