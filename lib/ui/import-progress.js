var Bar = require('./bar')

module.exports = function () {
  var bar = Bar()
  return function (importer) {
    if (!importer) return ''
    var importedBytes = importer.bytesImported
    var importedFiles = importer.fileCount - 1 // Importer counts files before importing
    if (importedFiles > 1) importedFiles = importedFiles - 1 // Do not count dat.json
    var progress = Math.round(importedBytes * 100 / importer.countStats.bytes)
    return bar(progress) + ` ${importedFiles} ${importedFiles === 1 ? 'file' : 'files'} imported`
  }
}
