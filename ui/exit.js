module.exports = function (log) {
  return function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    if (log) log.print()
    process.exit(0)
  }
}
