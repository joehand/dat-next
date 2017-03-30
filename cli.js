#!/usr/bin/env node

var minimist = require('minimist')
var logger = require('status-logger')
var pretty = require('prettier-bytes')
var speed = require('speedometer')
var progress = require('progress-string')
var dat = require('./')

process.title = 'dat-next'

var argv = minimist(process.argv.slice(2), {
  alias: {sleep: 's', quiet: 'q', watch: 'w'}
})
var src = argv._[0] || process.cwd()
var dest = argv._[1]

var output = [['', ''], ['', '', '', '']]
var log = logger(output, { quiet: argv.quiet })
var indexSpeed = speed()
var downloadSpeed = speed()
var hasContent
var imported = 0
var downloaded = 0
var total = 0

dat(src, dest, argv, function (archive, swarm, importProgress) {
  output[0][0] = 'Here we go!'
  setInterval(function () {
    networkUI()
    log.print()
    if (archive.downloaded) {
      console.log('Done! Bye bye.')
      process.exit(0)
    }
  }, 500)
  log.print()

  archive.once('content', function () {
    output[0].push('') // add space for peers
    hasContent = true
    if (!importProgress) downloadUI()
  })

  if (!importProgress) {
    output[0][0] = 'Connecting...'
    return
  }

  var bar
  output[0][0] = `dat://${archive.key.toString('hex')}`

  importProgress.on('count', function (count) {
    total = count.bytes
    bar = progress({
      total: total,
      style: function (a, b) {
        return `[${a}${b}] ${pretty(imported)}/${pretty(total)}`
      }
    })
    output[1][0] = bar(imported)
  })

  importProgress.on('put-data', function (chunk) {
    imported += chunk.length
    if (bar) output[1][0] = bar(imported)
    output[1][1] = pretty(indexSpeed(chunk.length)) + '/s'
    if (argv.watch) output[1][2] = 'Watching for changes...'
  })

  importProgress.on('put', function (src, dst) {
    var name = (dst.name === '/') ? src.name : dst.name // use prettier names if available
    output[1][3] = `ADD: ${name}`
  })

  importProgress.on('del', function (src, dst) {
    output[1][3] = `DEL: ${dst.name}`
  })

  importProgress.on('end', function (src, dst) {
    imported = total // TODO: end of put
    output[1] = [`Import complete: ${pretty(total)}`]
  })

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
      return progress({
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
