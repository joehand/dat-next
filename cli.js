#!/usr/bin/env node

var subcommand = require('subcommand')

process.title = 'dat'

var commands = [
  {
    name: 'clone',
    command: require('./commands/clone')
  },
  {
    name: 'create',
    command: require('./commands/create'),
    options: [
      {
        name: 'import',
        boolean: true,
        default: true
      }
    ]
  },
  {
    name: 'snapshot',
    command: require('./commands/snapshot')
  },
  {
    name: 'pull',
    command: require('./commands/pull')
  },
  {
    name: 'sync',
    command: require('./commands/sync'),
    options: [
      {
        name: 'import',
        boolean: true,
        default: true
      }
    ]
  }
]

var config = {
  defaults: [
    { name: 'dir', default: process.cwd() },
    { name: 'logspeed', default: 200 }
  ],
  none: none,
  commands: commands
}

var match = subcommand(config)
match(process.argv.slice(2))

function none () {
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
