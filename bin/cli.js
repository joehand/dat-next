#!/usr/bin/env node

var subcommand = require('subcommand')
var usage = require('../lib/usage')

process.title = 'dat-next'

var config = {
  defaults: [
    { name: 'dir', default: process.cwd() },
    { name: 'logspeed', default: 200 },
    { name: 'port', default: 3282 },
    { name: 'utp', default: true, boolean: true },
    { name: 'debug', default: process.env.DEBUG },
    { name: 'quiet', default: false, boolean: true },
    { name: 'verbose', default: false, boolean: true, abbr: 'v' },
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
    require('../lib/commands/snapshot'),
    require('../lib/commands/sync'),
    require('../lib/commands/auth/register'),
    require('../lib/commands/auth/whoami'),
    require('../lib/commands/auth/logout'),
    require('../lib/commands/auth/login'),
    {
      name: 'help',
      command: usage
    }
  ],
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
  opts.dir = opts._[0]
  var sync = require('../lib/commands/sync')
  opts.import = opts.import || true // TODO: use default opts in sync
  sync.command(opts)
}
