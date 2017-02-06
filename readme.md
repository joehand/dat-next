# dat-next

The next version of the `dat` command line tool.

Current version at [datproject/dat](https://github.com/datproject/dat).

## Currently Deprecated

dat-next `v2` has been released as `dat` version `12.0.0`.

### Install Dat:

```
npm install -g dat
```

[![Travis](https://img.shields.io/travis/joehand/dat-next.svg?style=flat-square&branch=master)](https://travis-ci.org/joehand/dat-next) [![npm](https://img.shields.io/npm/v/dat-next.svg?style=flat-square)](https://npmjs.org/package/dat-next)

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
