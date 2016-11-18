var Bar = require('./bar')

module.exports = function () {
  var bar = Bar()
  return function (importer) {
    if (!importer) return ''
    var importedFiles = importer.fileCount - 1 // TODO: bug in importer?
    var progress = Math.round(importedFiles * 100 / importer.countStats.files)
    return bar(progress) + ' ' + importedFiles + ' files imported'
  }
}
