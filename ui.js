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
  if (!state.archive) return `Starting...`
  var archive = state.archive
  var size = archive.content ? archive.content.byteLength : 0
  var files = archive.metadata.length - 1
  return output`
    ${state.downloading ? 'Downloading' : 'Syncing'} Archive: ${files} files (${pretty(size)})
  `
}

function networkUI (state) {
  // state.exiting = last render before download exit
  if (!state.network || state.downloadExit) return ''
  if (!state.network.connected || !state.archive.content) {
    if (state.writable) return ''// '\nWaiting for Connections...'
    return '\nConnecting...'
  }
  return output`

    ${state.archive.content.peers.length} peers
    ${speed()}
  `

  function speed () {
    var output = ''
    if (state.uploadSpeed) output += `Uploading ${pretty(state.uploadSpeed)}/s`
    // !state.nsync hack so speed doesn't display when done
    if (!state.nsync && state.downloadSpeed) output += `Downloading ${pretty(state.downloadSpeed)}/s`
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
    if (state.importer.putDone >= state.count.files) {
      if (state.importer.pending.length) return 'Importing updated files.'
      if (!state.opts.watch) return 'All files imported.'
      return 'Watching for file changes.'
    }
  } else {
    if (!state.importer.count.files) return `Checking for file updates ...`
    return output`
      Importing ${state.importer.count.files} files (${pretty(state.importer.count.bytes)})
    `
  }

  if (!state.totalBar) {
    var total = state.count.files
    state.totalBar = progress({
      total: total,
      style: function (a, b) {
        return `[${a}${b}] ${(100 * state.importer.putDone / total).toFixed(0)}%`
      }
    })
  }

  return output`
    Importing ${state.count.files} files to Archive
    ${state.totalBar(state.importer.putDone)}
  `
}

function fileImport (state) {
  if (!state.fileImport) return ''
  if (state.fileImport.type === 'del') return `\nDEL: ${state.fileImport.src.name}`
  var total = state.fileImport.src.stat.size
  var bar = progress({
    total: total,
    width: 35,
    style: function (a, b) {
      return `[${a}${b}] ${pretty(state.fileImport.progress)} / ${pretty(total)}`
    }
  })

  var name = state.fileImport.dst.name
  return output`
    ${pretty(state.importer.indexSpeed)}/s

    ADD: ${cliTruncate(name, process.stdout.columns - 5, {position: 'start'})}
    ${bar(state.fileImport.progress)}
  `
}
