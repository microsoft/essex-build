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
		"clean:all": "yarn workspaces foreach -piv run clean",
		"build:all": "yarn workspaces foreach -pivt run build",
		"bundle:all": "yarn workspaces foreach -piv run bundle",

		/* use @essex/scripts for top-level checks */
		"lint:all": "essex lint",
		"unit:test": "essex test --coverage",

		/* hook for CI builds */
		"ci": "run-s lint:all build:all bundle:all unit:test"
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
		"start": "webpack-dev-server"
	}
}
```
