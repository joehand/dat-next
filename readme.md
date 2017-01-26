# dat

> Dat is the package manager for datasets. Easily share, version control, and archive datasets. Secure, distributed, fast.

[<img src="http://datproject.github.io/design/downloads/dat-data-logo.png" align="right" width="140">](https://datproject.org)

[![#dat IRC channel on freenode](https://img.shields.io/badge/irc%20channel-%23dat%20on%20freenode-blue.svg)](http://webchat.freenode.net/?channels=dat)
[![datproject/discussions](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/datproject/discussions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![docs](https://img.shields.io/badge/Dat%20Project-Docs-green.svg)](http://docs.datproject.org)
[![protocol](https://img.shields.io/badge/Dat%20Protocol-green.svg)](http://www.datprotocol.com)

#### What is all this?

The Dat project is a set of open source applications for sharing data or files organized by [Code for Science & Society](http://codeforscience.org), a grant funded non-profit.
With the Dat applications you can share files with collaborators, back up data to servers, and automate long-term data preservation using the Dat protocol.
The Decentralized Archive Transport (Dat!) protocol transfers files in a **secure**, **distributed**, and **fast** network allowing you to focus on the fun work without worrying about moving files around.

* **Secure** - Dat data transfer is encrypted and the content verified on arrival. Changes are written to an append-only log ensuring transparency of updates. [Check out our security and privacy FAQ](#TODO).
* **Distributed** - With the Dat protocol you'll connect directly to other users or servers sharing or downloading common datasets. Any device can host files to share without the need for centralized servers. [Read about the distrbuted web and Dat](#TODO).
* **Fast** - Files download from multiple sources. Quickly sync updates by only downloading the new bytes, saving time and bandwidth. [Learn about how the Dat project makes file transfers fast](#TODO).

### Key features:

* **Share files** to colleagues, servers, or long-term archives.
* **Automatically update** changes by sharing new files and syncing with the network.
* **Distribute large datasets** without copying data to a central server by connecting directly to peers.
* **Version history data** by tracking all changes in metadata and easily backing up old versions of files on large storage servers.
* **Persistent identification** of changing datasets with a unique link.
* **Instantly host** files through the distributed network and unique identifier.

### Dat Applications

 Visit our site for an [installation guide](http://datproject.org/install) or pick your favorite client application:

* [Dat Command Line](#dat-command-line) - You are here! Scroll down for the details.
* [Dat Desktop](#TODO)
* [Beaker Browser](http://beakerbrowser.com) - An experimental p2p browser with built-in support for the Dat protocol
* [Dat Protocol](https://www.datprotocol.com) - Build your own Dat application on the Decentralized Archive Transport (Dat) protocol

---

## Dat Command Line

> Share, download, and backup files with the command line! Automatically sync changes to datasets. Never worry about manually transferring files again.

Mac/Linux      | Windows      | Version
-------------- | ------------ | ------------
[![Travis](https://api.travis-ci.org/joehand/dat-next/master.svg?style=flat-square)](https://travis-ci.org/joehand/dat-next) | [![Build status](https://ci.appveyor.com/api/projects/status/github/joehand/dat-next?branch=master&svg=true)](https://ci.appveyor.com/project/joehand/dat-next) | [![NPM version](https://img.shields.io/npm/v/dat-next.svg?style=flat-square)](https://npmjs.org/package/dat-next)

Have questions or need some guidance?
You can chat with us in IRC on [#dat](http://webchat.freenode.net/?channels=dat) or [Gitter](https://gitter.im/datproject/discussions?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)!

### Table of Contents

<li><a href="#getting-started">Getting Started</a></li>
<li><a href="#using-dat">Using Dat</a></li>
<li><a href="#troubleshooting">Troubleshooting</a></li>
<li><a href="#for-developers">For Developers</a></li>

## Getting Started

The Dat command line tool can be installed with `npm`. Make sure you have `node` version 4 or above and `npm` installed.
You can run `node -v` and `npm -v` to check!

Need to install Node? [Start here](#TODO-node/download).

### Installing Dat

Install `dat` from npm with the `--global, -g` option:

```
npm install -g dat
```

You should be able to run the `dat` command now. If not, see the [installation troubleshooting](#troubleshooting) for tips.

### Quickstart

You can mostly get around in the Dat command line world with two commands:

* `dat share <dir>`: share files from your computer to another computer/server. This will share your local `<dir>` and print a `dat://` link. Send the printed link to other users so they can download your files.
* `dat clone dat://<link> <download-dir>`: download files from a remote computer/server sharing files with Dat. This will download the files from `dat://<link>` to your `<download-dir>`.

#### TODO (maybe two gifs here?)

#### A Brief Primer on `dat://`` links

> You may have seen Dat links around: `dat://ff34725120b2f3c5bd5028e4f61d14a45a22af48a7b12126d5d588becde88a93`. What is with the weird long string of characters? Let's break it down!

##### `dat://` - the protocol

The first part of the link is the link protocol, Dat (read about the Dat protocol at [datprotocol.com](http://www.datprotocol.com)).
The protocol describes what "language" the link is in and what type of applications can open it.

##### `ff34725120b2f3c5bd5028e4f61d14a45a22af48a7b12126d5d588becde88a93` - the unique identifier

The second part of the link is a 64-character hex strings ([ed25519 public-keys](https://ed25519.cr.yp.to/) to be precise).
Each Dat archive gets a public key link to identify it.
With the hex string as a link we can do two things: 1) encrypt the data transfer and 2) give each archive a persistent identifier, an ID that never changes, even as file are updated (as opposed to a checksum which is based on the file contents).

##### `dat://ff34725120b2f3c5bd5028e4f61d14a45a22af48a7b12126d5d588becde88a93`

All together, the links can be thought of similarly to a web URL, as a place to get content, but with some extra special properties.
Links point to a set of files instead of a specific server.
This means when you run `dat clone dat://<link>` you do not have to worry about who is hosting the files at that link or if the content has changed.
You'll always get the latest content in the network and the link helps to verify the integrity of the content!

Try out `dat clone` with the link above to read more about the protocol!

---

## TODO starting here

---

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
dat create [<folder>] [--no-import]
```

Create a new Dat Archive in the current directory (or specify `dir`).
Will automatically import the files in that directory to the archive.

#### Syncing to Network

```
dat sync [<folder>] [--no-import] [--no-watch]
```

Start sharing your Dat Archive over the network.
Sync will import new or updated files since you ran `create` or `sync` last.
Sync watched files for changes and imports updated files.

* Use `--no-import` to not import any new or updated files.
* Use `--no-watch` to not watch directory for changes. `--import` must be true for `--watch` to work.

#### Snapshot

```
dat snapshot [<folder>]
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
dat pull [<folder>]
```

Update a cloned Dat Archive to latest files and exit.

```
dat sync [<folder>]
```

Download latest files and keep connection open to continue updating as remote source is updated.

### Shortcut commands

* `dat <link> {dir}` will run `dat clone` for new dats or resume the exiting dat in `dir`
* `dat {dir}` is the same as running `dat sync {dir}`

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
