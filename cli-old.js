#!/usr/bin/env node

var minimist = require('minimist')
var logger = require('status-logger')
var pretty = require('prettier-bytes')
var speed = require('speedometer')
var progressBar = require('progress-string')
var dat = require('./')

process.title = 'dat-next'

var argv = minimist(process.argv.slice(2), {
  alias: {sleep: 's', quiet: 'q', watch: 'w'}
})
var src = argv._[0] || process.cwd()
var dest = argv._[1]

var output = [
  ['', ''], // Key/Msg + Peer Count
  ['', ''], // Total Import/Download Progress
  ['', ''] // File Import Progress
]
var log = logger(output, { quiet: argv.quiet })
var indexSpeed = speed()
var downloadSpeed = speed()
var hasContent
var imported = 0
var downloaded = 0
var total = 0
var fileImported = 0
var bar
var totalBar
var watchTimeout

dat(src, dest, argv, function (archive, swarm, progress) {
  output[0][0] = 'Here we go!'
  setInterval(function () {
    networkUI()
    log.print()
    if (archive.downloaded) {
      log.clear()
      console.log('Done! Bye bye.')
      process.exit(0)
    }
  }, 200)
  log.print()

  archive.once('content', function () {
    hasContent = true
    imported = archive.content.byteLength
    if (!archive.metadata.writable) downloadUI()
  })
  swarm.once('connection', function () {
    output[0].push('') // add space for peers
  })

  if (!archive.metadata.writable) {
    output[0][0] = 'Connecting...'
    return
  }

  output[0][0] = `dat://${archive.key.toString('hex')}`

  progress.once('count', function (count) {
    total = count.bytes
    if (!argv.watch) {
      totalBar = progressBar({
        total: total,
        style: function (a, b) {
          return `[${a}${b}] ${pretty(imported)} / ${pretty(total)}`
        }
      })
      output[1][1] = totalBar(imported)
      output[1].push('') // Import Speed
      output[1].push('') // Spacer
    }
    updateImportTotal()
  })

  progress.on('put', function (src, dst) {
    // Show progress for files only
    if (src.stat.isDirectory()) return
    clearTimeout(watchTimeout)

    var name = (dst.name === '/') ? src.name : dst.name // use prettier names if available
    output[2][0] = `ADD: ${name}`
    fileImported = 0

    // Avoid flashing progress bar of small files
    if (src.stat.size > Math.pow(10,7) ) {
      bar = progressBar({
        total: src.stat.size,
        style: function (a, b) {
          return `[${a}${b}] ${pretty(fileImported)} / ${pretty(src.stat.size)}`
        }
      })
      output[2][1] = bar(fileImported)
    }
  })

  progress.on('put-data', function (chunk, src, dst) {
    imported += chunk.length
    fileImported += chunk.length

    if (bar) {
      output[2][1] = bar(fileImported)
      if (!totalBar) output[2][2] = `${pretty(indexSpeed(chunk.length))}/s`
    }
    updateImportTotal(chunk.length)
  })

  progress.on('put-end', function (src, dst) {
    // Remove put file progress
    if (bar) {
      output[2][1] = ''
      if (!totalBar) output[2][2] = ''
    }
    fileImported = 0
    bar = null
    updateImportTotal()

    if (argv.watch) {
      watchTimeout = setTimeout(function () {
        if (argv.watch) output[2] = [''] // clear output for idle watching
      }, 1200)
    }
  })

  progress.on('del', function (dst) {
    output[2][0] = `DEL: ${dst.name}`
    clearTimeout(watchTimeout)

    if (argv.watch) {
      watchTimeout = setTimeout(function () {
        if (argv.watch) output[2] = [''] // clear output for idle watching
      }, 1200)
    }
  })

  progress.on('end', function (src, dst) {
    // Only fires if argv.watch === false
    totalBar = null
    output[1] = [output[1][0]] // Clear total bar + import speed
    output[2] = [`\nImport complete`]
    setTimeout(function () {
      output.pop()
    }, 5000)
  })

  function updateImportTotal (size) {
    size = size || 0
    var verb = !argv.watch
      ? imported === total
      ? 'Sharing'
      : 'Importing to'
    : 'Syncing'

    output[1][0] = `${verb} Archive: ${archive.metadata.length - 1} files (${pretty(archive.content.byteLength)})`
    if (totalBar) {
      output[1][1] = totalBar(imported)
      output[1][2] = `${pretty(indexSpeed(size))}/s`
    }
  }

  function downloadUI () {
    var bar = downloadBar()
    archive.content.ready(function () {
      total = archive.content.length
      output[0][0] = `Downloading ${pretty(archive.content.byteLength)}`
      output[1][0] = bar(downloaded)
      for (var i = 0; i < archive.content.length; i++) {
        if (archive.content.has(i)) downloaded++
      }
    })

    archive.content.on('download', function (index, data) {
      if (archive.content.length !== total) {
        output[0][0] = `Downloading ${pretty(archive.content.byteLength)}`
        total = archive.content.length
        bar = downloadBar()
      }
      downloaded++
      var per = (downloaded / total * 100).toFixed(2)
      if (bar) output[1][0] = bar(downloaded) + ' ' + per + '%'
      output[1][1] = pretty(downloadSpeed(data.length)) + '/s'
    })

    function downloadBar () {
      return progressBar({
        total: total,
        style: function (a, b) {
          return `[${a}${b}]`
        }
      })
    }
  }

  function networkUI () {
    if (!swarm.connected || !hasContent) return
    output[0][1] = `${archive.content.peers.length} peers`
  }
})
