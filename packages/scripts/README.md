# @essex/scripts

This package provides scripts for common build tooling for the essex team. The philosophy of
these scripts are to provide a recommended configuration while allowing for escape-hatching.

# Setup

Add the following configuration to your `package.json`. If you're in a monorepo, this should be defined at the top level:

```json
{
	"devDependencies": {
		"@essex/scripts": "<latest version>"
	},
	"prettier": "@essex/prettier-config"
}
```

The **prettier** section allows for `pretty-quick` (used by our build system) and Visual Studio Code to detect the active prettier configuration.<br/>

Additional build tooling is wired in via invoking `essex`. Check out the available scripts and recipes below.

# Scripts

Scripts are invoked via the `essex` CLI tool. Commands are in the form `essex <commmand> <options>`.<br/>
To view detailed options, run `essex <command> --help` or `essex --help`

- [audit](./docs/audit.md)
- [build](./docs/build.md)
- [bundle](./docs/bundle.md)
- [clean](./docs/clean.md)
- [init](./docs/init.md)
- [lint](./docs/lint.md)
- [precommit](./docs/precommit.md)
- [prettify](./docs/prettify.md)
- [serve](./docs/serve.md)
- [test](./docs/test.md)
- [watch](./docs/watch.md)

# Recipes

```json
{
	"name": "monorepo-root",
	"private": true,
	"scripts": {
		/* orchestrate child packages */
		"clean": "yarn workspaces foreach -piv run clean",
		"build": "yarn workspaces foreach -pivt run build",
		"bundle": "yarn workspaces foreach -piv run bundle",

		/* use @essex/scripts for top-level checks */
		"unit_test": "jest --coverage",

		/* hook for CI builds */
		"ci": "run-s lint build bundle unit_test"
	}
}
```

```json
{
	"name": "library-package",
	"version": "1.0",
	"main": "dist/cjs/index.js",
	"module": "dist/esm/index.js",
	"types": "dist/types/index.d.ts",
	"scripts": {
		"build": "essex build",
		"clean": "essex clean",
		"start": "essex watch"
	}
}
```

```json
{
	"name": "webpack-app",
	"private": true,
	"scripts": {
		"bundle": "webpack",
		"clean": "essex clean build",
		"start": "webpack serve"
	}
}
```

# Release Process

First, you should define an environment variable in your shell called `NPM_AUTH_TOKEN`, which has publication permissions into the @essex/ namespace. You can get this by running `npm login` and then copying the token from `~/.npmrc`.

Each PR should generate a change file in `.yarn/versions`. These are used to calculate semver. When it's time for a release, do the following:

* Cut a new branch `release/<date>` or `release/vX.Y.Z`, where the version aligns with the next release of @essex/scripts.
* Run `yarn release`. Internally, this will:
    * Run `yarn version apply --all` to bump the versions of all affected packages using the semver documents.
		* Run `ci`
		* Run `yarn publish` to publish the latest versions of all packages.
* Commit all changes and push the branch.
* Create a PR for the release branch.