#!/usr/bin/env node

var subcommand = require('subcommand')
var fs = require('fs')
var usage = require('../lib/usage')

process.title = 'dat-next'

var config = {
  defaults: [
    { name: 'dir', default: process.cwd(), help: 'set the directory for Dat' },
    { name: 'logspeed', default: 200 },
    { name: 'port', default: 3282, help: 'port to use for connections' },
    { name: 'utp', default: true, boolean: true, help: 'use utp for discovery' },
    { name: 'debug', default: process.env.DEBUG }, // TODO: does not work right now
    { name: 'quiet', default: false, boolean: true },
    { name: 'server', default: 'https://dat.land/api/v1' }
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
    command: usage
  },
  none: syncShorthand,
  commands: [
    require('../lib/commands/clone'),
    require('../lib/commands/create'),
    require('../lib/commands/doctor'),
    require('../lib/commands/publish'),
    require('../lib/commands/pull'),
    require('../lib/commands/share'),
    require('../lib/commands/snapshot'),
    require('../lib/commands/sync'),
    require('../lib/commands/auth/register'),
    require('../lib/commands/auth/whoami'),
    require('../lib/commands/auth/logout'),
    require('../lib/commands/auth/login')
  ],
  usage: {
    command: usage,
    option: {
      name: 'help',
      abbr: 'h'
    }
  },
  aliases: {
    'init': 'create'
  }
}

var match = subcommand(config)
match(alias(process.argv.slice(2)))

function alias (argv) {
  var cmd = argv[0]
  if (!config.aliases[cmd]) return argv
  argv[0] = config.aliases[cmd]
  return argv
}

function syncShorthand (opts) {
  if (!opts._.length) return usage(opts)
  try {
    opts.dir = opts._[0]
    fs.stat(opts.dir, function (err, stat) {
      if (err || !stat.isDirectory()) return usage(opts)

      var sync = require('../lib/commands/sync')
      opts.import = opts.import || true // TODO: use default opts in sync
      sync.command(opts)
    })
  } catch (e) {
    return usage(opts)
  }
}
