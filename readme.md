# dat-next

[![Travis](https://img.shields.io/travis/joehand/dat-next.svg?style=flat-square&branch=master)](https://travis-ci.org/joehand/dat-next) [![npm](https://img.shields.io/npm/v/dat-next.svg?style=flat-square)](https://npmjs.org/package/dat-next)

[<img src="http://datproject.github.io/design/downloads/dat-data-logo.png" align="right" width="140">](https://datproject.org)

Dat syncs data and files across the distributed web. Dat is optimized for speed, simplicity, and security. Read more at [datproject.org](https://datproject.org/).

This repository is the new version of the command line tool for Dat.

If you have questions you can chat with us in IRC on [#dat](http://webchat.freenode.net/?channels=dat) or [Gitter](https://gitter.im/datproject/discussions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge).

### Features

* *Share files*: Send files to colleagues, other computers, or servers to synchronize across devices and backup.
* *Clone Dat archives*: Download and live sync Dat archives published by anyone.
* *Publish*: Make it easy to clone datasets by publishing a Dat link to the Dat registry.

### Development Status

**dat-next** is the new version of the Dat command line interface, to replace [datproject/dat](https://github.com/datproject/dat).

`dat-next` Version 2.x.x will be released on dat-next as a beta test.
After user testing and stability improvements, we will move development and releases to datproject/dat.

**Upgrading from the old Dat command line tool? [See what the changes are](#upgrading).**

## Getting Started

The dat-next command line tool can be used to share, download, and sync files across many computers via the command line.

### Installation

Install via npm:

```
npm install -g dat-next
```

**Note: if you previously installed dat with `npm install -g dat`, this will overwrite the old `dat` command.**

You can make sure the install worked by running the `dat` command.
The usage guide should print.

See the [installation troubleshooting](https://github.com/datproject/dat#troubleshooting) for tips if the installation failed.

### Quickstart

#### Sharing Files

* `cd my-files-to-share` - change to the folder to share
* `dat create` - create a Dat archive and import the files from the folder

```
dat create
Dat Archive initialized: /path/to/my-files-to-share
Link: dat://56c1977328c94c988137c9ff3cbeaab217d765772299840e7be7172b18dbb151

File import finished!
Total Size: 50 files (40.5 MB)
```

Now you should have a `.dat` folder inside `my-files-to-share`. Once the dat is created, you can start sharing it over the p2p network:

* `dat sync` - share the files over the Dat network

```
dat-next sync
Syncing Dat Archive: /path/to/my-files-to-share
Link: dat://56c1977328c94c988137c9ff3cbeaab217d765772299840e7be7172b18dbb151

Watching files for changes...
Total Size: 50 files (40.5 MB)

Looking for connections in Dat Network...
```

The `sync` command will also watch your directory for changes and share any updated files.

#### Downloading Files

Once the files are shared somewhere, you can clone them to another location:

* `dat clone dat://56c1977328c94c988137c9ff3cbeaab217d765772299840e7be7172b18dbb151 download-folder` - Clones all the files from the shared Dat archive.

```
dat clone dat://56c1977328c94c988137c9ff3cbeaab217d765772299840e7be7172b18dbb151 download-folder
Cloning Dat Archive: /path/to/download-folder
Link: dat://56c1977328c94c988137c9ff3cbeaab217d765772299840e7be7172b18dbb151

Metadata: [==================================================>] 100%
Content:  [====================>------------------------------] 41%
Total size: 50 files (40.5 MB)

1 peer on the Dat Network
Downloading: 5.6 MB/s
```

##### Downloading Updates

After you clone a Dat archive, you can update the files later:

* `cd download-folder`
* `dat pull` - download updates and exit

```
dat pull
Pulling Dat Archive: /path/to/download-folder
Link: dat://56c1977328c94c988137c9ff3cbeaab217d765772299840e7be7172b18dbb151


Download Finished!
Total size: 50 files (40.5 MB)
```

### Demo File Download

To get started using Dat, we can download files via Dat. Similar to git, you do this by running `dat clone`:

```
dat clone dat://df6d299c7c90334537242487919785ab339e11ee9c1b8fda9ea28d9bf31a3d08 datproject-website
```

This will download the files shared at that link to a folder named datproject-website.

Dat archives are given an link that you use to share or download, similar to a website URL.
In this case, this link has the files from the datproject.org website.
Dat archive links are 64 characters long and prefixed with `dat://`.

Along with the link, you can tell Dat where to clone the files.
All together, you can download files by typing `dat clone <dat-link> <download-directory>`.

If the source files are updated you can run `dat pull` or `dat sync` inside the directory to update the files.

```
cd datproject-website
dat pull
```

`dat sync` will do the same thing but keeps running until you stop it.
`dat pull` will update the files and exit.

## Usage

Dat archives have a one to many relationship, there is a single source that can create and write files and many peers that can download the files *(in future versions there may be several sources)*.

* **Sharing**: If you want to share files from your computer that you will update, you are the *source archive* or *local archive*.
* **Downloading**: If your colleague has files they want to share, they will be the source and you'll be downloading from a *remote archive*.

The first commands, *init* or *clone*, creates a `.dat` folder where the Dat metadata is stored.
Once a Dat is created, you can run all the commands inside that folder, similar to git.

### Sharing

The quickest way to get started sharing files is to `share`:

```
> dat share

Syncing Dat Archive: /Users/joe/Desktop/datproject-website
Link: dat://b44a53f3dcad90349ba743e21fca4869cd3fb79d9f8b55a556af04e5ad49bb79

Archive update finished! Sharing latest files.
Total Size: 51 files (3.23 MB)

Looking for connections in Dat Network...
```

You can also do `create` and `sync` in separate steps if you'd like more control over the importing.

#### Creating a Dat archive

```
dat create [--dir=<folder>] [--no-import]
```

Create a new Dat Archive in the current directory (or specify `--dir`).
Will automatically import the files in that directory to the archive.

#### Syncing to Network

```
dat sync [--dir=<folder>] [--no-import] [--no-watch]
```

Start sharing your Dat Archive over the network.
Sync will import new or updated files since you ran `create` or `sync` last.
Sync watched files for changes and imports updated files.

* Use `--no-import` to not import any new or updated files.
* Use `--no-watch` to not watch directory for changes. `--import` must be true for `--watch` to work.

#### Snapshot

```
dat snapshot [--dir=<folder>]
```

Snapshot will create the archive in snapshot, `{live: false}`, mode.


### Downloading

```
dat clone <dat-link> [<folder>] [--temp]
```

Clone a remote Dat Archive to a local folder.
Will create a folder with the key name is no folder is specified.

##### Options

`--temp`: Creates a temporary database and doesn't save the metadata to disk, only the latest files.

#### Updating Downloaded Archives

Once a Dat is clone, you can run either `dat pull` or `dat sync` in the folder to update the archive.

```
dat pull [--dir=<folder>]
```

Update a cloned Dat Archive to latest files and exit.

```
dat sync [--dir=<folder>]
```

Download latest files and keep connection open to continue updating as remote source is updated.

### Dat Registry and Authentication

As part of our [Knight Foundation grant](https://datproject.org/blog/2016-02-01-announcing-publicbits), we are building a registry for Dat archives.
We will be running a Dat registry at datproject.org, but anyone will be able to create their own.
Once registered, you will be able to publish Dat archives from our registry.
Anyone can clone archives published to a registry without registration:

```
dat clone datproject.org/karissa/more-tweets-more-votes
```

#### Auth (experimental)

Other auth commands are still in an experimental status.
New registrations on the Dat archive registry are currently limited.

```
dat register
dat login
dat logout
dat whoami
```

Once you are logged in to a server. You can publish a Dat archive:

```
cd my-data
dat create
dat publish
```

All authentication and publishing requests take the `--server` option.
You can deploy your own compatible [registry server](https://github.com/datproject/datfolder) if you'd rather use your own service.

### Upgrading

If you are familiar with the old Dat CLI, there will only be minor changes to use dat-next.

To share files with Dat, you'll need two commands now instead of one.

```
cd my-folder
dat create
dat sync
```

After the Dat archive is created, you can run `dat sync` in the folder to share updates or use the same command as the old dat: `dat my-folder`.

To download files, you can use `dat clone` which will do the same thing as `dat <link>` did before:

```
dat clone dat://<link> download-folder
```

Once the initial download is complete, you can use `dat pull` inside to folder to update or use the same command as the old dat: `dat download-folder`.

### Compatibility

All archives created previously will still work with dat-next.

#### Shared a folder with the old Dat?

With `dat-next` you can still run `dat path/to/my-folder`.
This is a shortcut for `dat sync path/to/my-folder`, which will connect to the network and import new and updated files.

#### Downloaded a folder with the old Dat?

With `dat-next` you can still run `dat path/to/my-folder`.
This is a shortcut for `dat sync path/to/my-folder`, which will connect to the network and download updates.

You can also use `dat pull` to update files and exit:

```
cd path/to/my-folder
dat pull
```

## For Developers

This command line library uses [dat-node](https://github.com/datproject/dat-node) to create and manage the archives and networking.
If you'd like to build your own Dat application that is compatible with this command line tool, we suggest using dat-node.

### Installing from source

Clone this repository and in a terminal inside of the folder you cloned run this command:

```
npm link
```

This should add a `dat` command line command to your PATH. Now you can run the dat command to try it out.

The contribution guide also has more tips on our [development workflow](https://github.com/datproject/dat/blob/master/CONTRIBUTING.md#development-workflow).

* `npm run test` to run tests
* `npm run auth-server` to run a local auth server for testing
