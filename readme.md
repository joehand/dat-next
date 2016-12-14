# dat-next [![Travis](https://img.shields.io/travis/joehand/dat-next.svg?style=flat-square)](https://travis-ci.org/joehand/dat-next) [![npm](https://img.shields.io/npm/v/dat-next.svg?style=flat-square)](https://npmjs.org/package/dat-next)

An experimental dat cli client!

## Usage

### Sharing

```
dat-next create [--dir=<folder>] [--no-import]
dat-next snapshot [--dir=<folder>]
```

Create a new Dat Archive in the current directory (or specify `--dir`). Will automatically import the files in that directory to the archive.

Snapshot will create the archive in snapshot, `{live: false}` mode.

```
dat-next sync [--dir=<folder>] [--no-import]
```

Start sharing your Dat Archive over the network. Will import new or updated files since you ran `create` or `sync` last.

### Downloading

```
dat-next clone <dat-link> [<folder>] [--temp]
```

Clone a remote Dat Archive to a local folder. Will create a folder with the key name is no folder is specified.

##### Options

`--temp`: Creates a temporary database and doesn't save the metadata to disk, only the latest files.

```
dat-next pull [--dir=<folder>]
```

Update a cloned Dat Archive to latest files and exit.

```
dat-next sync [--dir=<folder>]
```

Download latest files and keep connection open to continue updating as remote source is updated.

## Auth (experimental)

```
dat-verb logout
dat-verb login
dat-verb register
dat-verb whoami
```

All take `server` option along with `username` and `password`.

## Development

* `npm run test` to run tests
* `npm run auth-server` to run a local auth server for testing
* Run with `--use-routes` option for testing local servers with the default datfolder routes.
