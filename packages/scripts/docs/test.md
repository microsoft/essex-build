# > essex test

Runs unit tests using Jest. By default, we run tests named `<testname>.spec.ts(x|)` that exist in `__tests__` folders within the repository. Files in these folders are skipped when counting test coverage.

# CLI Options

- `--verbose`<br/> enables verbose mode
- `--config-file <file>`<br/> configuration file to use
- `--watch`<br/> set up tests in watch mode
- `--coverage<br/>`<br/> apply test coverage
- `--ci`<br/> use continuous integration mode
- `--clear-cache`<br/> clear Jest internal cache
- `--update-snapshots`<br/> update test snapshots
- `--browser`<br/> Respect the "browser" field in package.json when resolving modules.
  Some packages export different versions based on whether they are operating in Node or a browser.
- `--coverageThreshold`<br/> A JSON string with which will be used to configure minimum threshold enforcement for coverage results

# Details & Customization

To define a setup script, create a file named `jest.setup.js` in your package root. This file should contain any polyfills or enzyme configuration your tests may need beforehand.

You may also define a file named `tsconfig.jest.json` to override the default jest TypeScript configuration.
