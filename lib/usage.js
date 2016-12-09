module.exports = function (opts) {
  if (opts.version) {
    var pkg = require('../package.json')
    console.log(pkg.version)
    process.exit(0)
  }
  console.error('Usage: dat-next <cmd> [options]')
  console.error('   dat-next create                        create a local dat')
  console.error('   dat-next snapshot                      create a local dat snapshot')
  console.error('   dat-next sync                          sync latest files with the network. archive owners import updated files to share.')
  console.error('   dat-next clone <dat-link> <directory>  clone a remote dat')
  console.error('   dat-next pull                          download updated files from a remote dat and exit')
  console.error('   dat-next doctor                        run the dat network doctor')
  console.error('   dat-next register                      register for an account')
  console.error('   dat-next login                         login to an account')
  console.error('   dat-next --version,-v                  get your dat-next version')
  console.error('')
  console.error('     --dir=<folder>                  set directory (all commands)')
  console.error('     --no-import                     do not import files (create, sync)')
  console.error('     --quiet                         only print out the dat link')
  console.error('     --port=3282                     set the port for discovery')
  console.error('     --no-utp                        do not use utp for network connections')
  process.exit(1)
}
