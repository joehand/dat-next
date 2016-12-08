module.exports = function () {
  console.error('Usage: dat-next <cmd> [options]')
  console.error('   dat-next clone <dat-link> <directory>  clone a remote dat')
  console.error('   dat-next create                        create a local dat')
  console.error('   dat-next pull                          download updated files from a remote dat')
  console.error('   dat-next sync                          sync latest files with the network & import new files')
  console.error('   dat-next snapshot                      create a local dat snapshot')
  console.error('   dat-next doctor                        run the dat network doctor')
  console.error('')
  console.error('     --dir=<folder>                  set directory (all commands)')
  console.error('     --no-import                     do not import files (create, sync)')
  process.exit(1)
}
