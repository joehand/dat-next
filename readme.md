# dat-next

[![Travis](https://img.shields.io/travis/joehand/dat-next.svg?style=flat-square&branch=master)](https://travis-ci.org/joehand/dat-next) [![npm](https://img.shields.io/npm/v/dat-next.svg?style=flat-square)](https://npmjs.org/package/dat-next)

### Development Status

**dat-next** is the next version of the Dat command line interface, to replace [datproject/dat](https://github.com/datproject/dat).

Version 2.x.x will be released on dat-next as a beta test.
After user testing, we will move development and releases to datproject/dat.

## Getting Started

The dat-next command line tool can be used to share, download, and sync files across many computers via the command line.

### Installation

Install via npm:

```
npm install -g dat-next
```

You can make sure the install worked by running the `dat` command.
The usage guide should print.

See the [installation troubleshooting](https://github.com/datproject/dat#troubleshooting) for tips if the installation failed.

### Quickstart

#### Sharing Files

1. `cd my-files-to-share` - go to the directory that you want to share
2. `dat create` - create a Dat archive and import the files from the folder
3. `dat sync` - share the files over the Dat network

#### Downloading Files

1. `dat clone dat://<dat-hash> download-folder` - Clones all the files from a remote Dat archive.

##### Downloading Updates

After you clone a Dat archive, you can update the files later:

1. `cd download-folder`
2. `dat pull` - download updates and exit

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
dat-next pull
```

`dat sync` will do the same thing but keeps running until you stop it.
Pull will update the files and exit.

## Usage

Dat archives currently have a one to many relationship, there is a single source that can create and write files and many peers that can download the files *(in future versions there may be several sources)*.

* **Sharing**: If you want to share files from your computer that you will update, you are the *source archive* or *local archive*.
* **Downloading**: If your colleague has files they want to share, they will be the source and you'll be downloading from a *remote archive*.

The first commands, *init* or *clone*, will make a Dat archive folder.
This creates a `.dat` folder where the Dat metadata is stored.
Once a Dat is created, you can run all the commands inside that folder, similar to git.

### Sharing

#### Creating a Dat archive

```
dat-next create [--dir=<folder>] [--no-import]
```

Create a new Dat Archive in the current directory (or specify `--dir`).
Will automatically import the files in that directory to the archive.


```
dat-next sync [--dir=<folder>] [--no-import]
```

Start sharing your Dat Archive over the network.
Sync will import new or updated files since you ran `create` or `sync` last.


#### Snapshot

```
dat-next snapshot [--dir=<folder>]
```

Snapshot will create the archive in snapshot, `{live: false}` mode.


### Downloading

```
dat-next clone <dat-link> [<folder>] [--temp]
```

Clone a remote Dat Archive to a local folder.
Will create a folder with the key name is no folder is specified.

##### Options

`--temp`: Creates a temporary database and doesn't save the metadata to disk, only the latest files.

#### Updating Downloaded Archives

Once a Dat is clone, you can run either `dat pull` or `dat sync` in the folder to update the archive.

```
dat-next pull [--dir=<folder>]
```

Update a cloned Dat Archive to latest files and exit.

```
dat-next sync [--dir=<folder>]
```

Download latest files and keep connection open to continue updating as remote source is updated.

## Dat Registry and Authentication

As part of our [Knight Foundation grant](https://datproject.org/blog/2016-02-01-announcing-publicbits), we are building a registry for Dat archives.
Once registered, you will be able to publish Dat archives from the registry.
Anyone can clone archives published to the registry without registration:

```
dat clone karissa/more-tweets-more-votes
```

### Auth (experimental)

Other auth commands are still in an experimental status.
New registrations on dat.land are currently limited.

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

All take a `server` option along with `username` and `password`.

## Development

* `npm run test` to run tests
* `npm run auth-server` to run a local auth server for testing
