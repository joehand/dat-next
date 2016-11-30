module.exports = function () {
  console.error('Usage: dat-verb <cmd> [options]')
  console.error('   dat create                        create a local dat')
  console.error('   dat snapshot                      create a local dat snapshot')
  console.error('   dat sync                          sync latest files with the network. archive owners import updated files to share.')
  console.error('   dat clone <dat-link> <directory>  clone a remote dat')
  console.error('   dat pull                          download updated files from a remote dat and exit')
  console.error('')
  console.error('     --dir=<folder>                  set directory (all commands)')
  console.error('     --no-import                     do not import files (create, sync)')
  process.exit(1)
}
