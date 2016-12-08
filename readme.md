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
dat-next clone <dat-link> [<folder>]
```

Clone a remote Dat Archive to a local folder. Will create a folder with the key name is no folder is specified.


```
dat-next pull [--dir=<folder>]
```

Update a cloned Dat Archive to latest files and exit.

```
dat-next sync [--dir=<folder>]
```

Download latest files and keep connection open to continue updating as remote source is updated.
