var pretty = require('prettier-bytes')
var progress = require('progress-string')
var cliTruncate = require('cli-truncate')
var output = require('neat-log/output')

module.exports = {
  main: mainView,
  progress: progressView
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
  else if (state.importer) {
    return output`

      ${importUI(state)}
      ${fileImport(state)}
    `
  }
  return ''
}

function archiveUI (state) {
  if (!state.archive) return ''
  var archive = state.archive

  var stats = state.stats.get()
  var size = stats.byteLength || 0
  var files = stats.files
  return output`
    ${state.downloading ? 'Downloading' : 'Syncing'} Archive: ${files} files (${pretty(size)})
  `
}

function networkUI (state) {
  // state.exiting = last render before download exit
  if (!state.network || state.downloadExit) return ''
  if (!state.network.connected || !state.archive.content) {
    if (state.writable) return '\nNo Connections'// '\nWaiting for Connections...'
    return '\nConnecting...'
  }
  return output`

    ${state.archive.content.peers.length} peers ${speed()}
  `

  function speed () {
    var output = ''
    var upSpeed = state.uploadSpeed || 0
    var downSpeed = state.downloadSpeed || 0
    output += `Uploading ${pretty(upSpeed)}/s `
    output += `Downloading ${pretty(downSpeed)}/s`
    if (output.length) output = '| ' + output
    return output
  }
}

function downloadUI (state) {
  if (state.nsync) {
    return output`

      Archive up to date.
      ${state.opts.live ? 'Waiting for changes...' : ''}
    `
  }
  if (!state.downloaded) {
    return '' // no metadata yet
  }
  if (!state.downloadBar) {
    makeBar()
    state.archive.on('update', makeBar)
  }
  return output`

    ${state.downloadBar(state.downloaded)}
  `

  function makeBar () {
    var total = state.archive.content.length
    state.downloadBar = progress({
      total: total,
      style: function (a, b) {
        return `[${a}${b}] ${(100 * state.downloaded / total).toFixed(2)}%`
      }
    })
  }
}

function importUI (state) {
  if (state.count) {// Initial import done
    if (state.importer.putDone.files >= state.count.files) {
      if (state.importer.pending.length) return 'Importing updated files.'
      if (!state.opts.watch) return 'All files imported.'
      return 'Watching for file changes.'
    }
  } else {
    if (!state.importer.count.files) return `Checking for file updates ...`
      var indexSpeed = state.importer.indexSpeed ? `(${pretty(state.importer.indexSpeed)}/s)` : ''
    return output`
      Imported ${state.importer.putDone.files} of ${state.importer.count.files} files ${indexSpeed}
      (Calculating total import count...)
    `
  }

  var total = state.count.bytes
  var totalBar = progress({
    total: total,
    style: function (a, b) {
      return `[${a}${b}] ${(100 * state.importer.putDone.bytes / total).toFixed(0)}%`
    }
  })

  return output`
    Importing ${state.count.files} files to Archive (${pretty(state.importer.indexSpeed)}/s)
    ${totalBar(state.importer.putDone.bytes)}
  `
}

function fileImport (state) {
  if (!state.fileImport) return ''
  if (state.fileImport.type === 'del') return `\nDEL: ${state.fileImport.src.name}`

  var total = state.fileImport.src.stat.size
  // var bar = progress({
  //   total: total,
  //   width: 35,
  //   style: function (a, b) {
  //     return `[${a}${b}] ${pretty(state.fileImport.progress)} / ${pretty(total)}`
  //   }
  // })

  var name = state.fileImport.dst.name.substr(1) // del / at start
  var size
  // >500 mb show progress to
  if (total < 5e8) size = `(${pretty(total)})`
  else size = `(${pretty(state.fileImport.progress)} / ${pretty(total)})`
  return output`

    ADD: ${cliTruncate(name, process.stdout.columns - 7 - size.length, {position: 'start'})} ${size}
  `
  // ${bar(state.fileImport.progress)}
}
