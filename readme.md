# dat-next

The next version of the `dat` command line tool.

**WITH HYPERDB!!** 🌟

Current version at [datproject/dat](https://github.com/datproject/dat).

**Warning: many bugs and not stable. May delete all your data!**

#### Known Bugs:

* Not really much UI
* Resuming doesn't work
* weird importing stuff going on
* No files storage
    - sharing: files copied to db storage (takes up double size on HD)
    - downloading: db in memory and copied to files

## Install:

```
npm install -g dat-next
```

## Usage

### Share a directory:

```
dat-next <dir> [options]
    --temp,-t     keep data in memory
```

### Download `key` to `dir`:

```
dat-next <key> <dir> [options]
```
