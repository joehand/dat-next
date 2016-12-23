var Bar = require('./bar')

module.exports = function () {
  var bar = Bar()
  return function (importer) {
    if (!importer) return ''
    var importedFiles = importer.fileCount - 1 // TODO: bug in importer?
    var progress = Math.round(importer.bytesImported * 100 / importer.countStats.bytes)
    return bar(progress) + ' ' + progress + '% ' + importedFiles + ' files imported'
  }
}
