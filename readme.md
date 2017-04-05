# dat-next

The next version of the `dat` command line tool.

**WITH SLEEP!!**  😴

Current version at [datproject/dat](https://github.com/datproject/dat).

## Install:

```
npm install -g dat-next
```

## Usage

### Share files:

```
❯ dat-next my-data/ 
dat://22607c7238e0cd74faa239d4119f32f455bb5bd555987090b2696dd0b090db38
```

### Download files:

```
❯ dat-next my-data/

```

### Share a directory:

```
dat-next <dir> [options]
    --temp,-t     keep sleep data in memory
    --watch, -w   watch folder for changes + auto import
```

### Download `key` to `dir`:

```
dat-next <key> <dir> [options]
    --temp,-t     keep sleep data in memory
```
