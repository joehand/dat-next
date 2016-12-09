#!/usr/bin/env node

var subcommand = require('subcommand')

process.title = 'dat-next'

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
    require('../lib/commands/sync'),
    require('../lib/commands/doctor'),
    require('../lib/commands/auth/register'),
    require('../lib/commands/auth/whoami'),
    require('../lib/commands/auth/logout'),
    require('../lib/commands/auth/login')
  ]
}

var match = subcommand(config)
match(process.argv.slice(2))
