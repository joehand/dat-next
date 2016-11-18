# dat-verb

An experimental dat cli client!

## Usage

### Sharing

```
dat-verb create [--dir=<folder>] [--no-import]
```

Create a new Dat Archive in the current directory (or specify `--dir`). Will automatically import the files in that directory to the archive.

```
dat-verb sync [--dir=<folder>] [--no-import]
```

Start sharing your Dat Archive over the network. Will import new or updated files since you ran `create` or `sync` last. 

### Downloading

```
dat-verb clone <dat-link> [<folder>]
```

Clone a remote Dat Archive to a local folder. Will create a folder with the key name is no folder is specified.


```
dat-verb pull [--dir=<folder>]
```

Update a cloned Dat Archive to latest files and exit.

```
dat-verb sync [--dir=<folder>]
```

Download latest files and keep connection open to continue updating as remote source is updated.
