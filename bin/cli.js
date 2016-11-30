#!/usr/bin/env node

var subcommand = require('subcommand')

process.title = 'dat'

var config = {
  defaults: [
    { name: 'dir', default: process.cwd() },
    { name: 'logspeed', default: 200 }
  ],
  root: require('../lib/usage'),
  none: require('../lib/usage'),
  commands: [
    require('../lib/commands/clone'),
    require('../lib/commands/create'),
    require('../lib/commands/pull'),
    require('../lib/commands/snapshot'),
    require('../lib/commands/sync')
  ]
}

var match = subcommand(config)
match(process.argv.slice(2))
