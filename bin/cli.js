#!/usr/bin/env node

var subcommand = require('subcommand')

process.title = 'dat-next'

var config = {
  defaults: [
    { name: 'dir', default: process.cwd() },
    { name: 'logspeed', default: 200 },
    { name: 'port', default: 3282 },
    { name: 'quiet', default: false },
    { name: 'utp', default: true }
  ],
  root: {
    options: [
      {
        name: 'version',
        boolean: true,
        default: false,
        abbr: 'v'
      }
    ],
    command: require('../lib/usage')
  },
  none: require('../lib/usage'),
  commands: [
    require('../lib/commands/clone'),
    require('../lib/commands/create'),
    require('../lib/commands/pull'),
    require('../lib/commands/snapshot'),
    require('../lib/commands/sync'),
    require('../lib/commands/doctor')
  ]
}

var match = subcommand(config)
match(process.argv.slice(2))
