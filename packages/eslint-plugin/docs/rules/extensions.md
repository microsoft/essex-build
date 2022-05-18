# @essex/extensions - Enforce the use of file extensions in import/export paths within esm modules or prevent the use of file extensions in import/export paths within commonjs modules.

ESM modules require the use of file extensions within relative import/export path specifiers while commonjs modules are expected to omit file extensions in relative import/export specifiers. This rule allows specifying which files are expected to include file extensions in relative import/export paths and which files are not allowed to use file extensions.

[More on esm import specifiers](https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_import_specifiers)

> :warning: This rule does resolve import/export paths to ensure the modules exists on disk and therefore will not provide any warnings or errors when importing/exporting nonexistent modules. For more import related rules check out https://github.com/import-js/eslint-plugin-import

## Rule Details

This rule accepts either a single string argument or a string argument and an array of settings that specify how extension rules should be applied to different sets of files.

```
"@essex/extensions": "error" | "warning" | "off"
```

```
"@essex/extensions": ["error', Array<SETTINGS_OBJECT>]
```

### Require the use of file extensions

Here is a basic example requiring the use of file extensions in esm modules.

```json
{
  "plugins": ["@essex/eslint-plugin"],
  "rules": {
    "@essex/extensions": [
      "error",
      [
        {
          "files": ["**/*.{ts,tsx,mts,js,jsx,mjs}"],
          "ignorePackages": true,
          "relativeModulePrefixes": ["./"],
          "expectedExtensions": [".js"],
          "disallowedExtensions": []
        }
      ]
    ]
  }
}
```

### Options

- `files`: [optional] Array\<file paths | glob patterns> (using https://www.npmjs.com/package/micromatch) - indicates which files should be impacted by the rule. Defaults to `["**/*.{ts,tsx,js,jsx,mts,mjs}"]`
- `ignorePackages`: [optional] boolean - indicates whether or not bare specifiers - imports of global and external modules - should be impacted by the rule. Defaults to `true` - ignore imports of global and external modules.
- `relativeModulePrefixes`: [optional] Array\<string> - list of prefixes that, when present, indicate that the import/export is considered a relative import/export and not one of a global/external package. Defaults to `["./"]`.
- `expectedExtensions`: Array\<string> - List of file extensions that must be used in relative import/exports. Defaults to `[".js"]`.
- `disallowedExtensions`: Array\<string> - List of file extenions that should never be present in relative import/exports. Useful for preventing the use of file extensions in commonjs modules. Defaults to `[]`.

The above example is the default set of options and is geared towards enforcing the use of file extensions within esm modules. Thefore the following rule configuration is equivalent.

```
"@essex/extensions": "error"
```

### Disallow the use of file extensions

Example of preventing the use of file extensions in commonjs modules.

```json
{
  "plugins": ["@essex/eslint-plugin"],
  "rules": {
    "@essex/extensions": [
      "error",
      [
        {
          "files": ["**/*.{cts,cjs}"],
          "expectedExtensions": [],
          "disallowedExtensions": [".js"]
        }
      ]
    ]
  }
}
```

### Mixing modules

It is possible to mix esm modules and commonjs modules in a single project through the use of file extensions such as `.mjs` and `.cjs`. It is for this reason that this rule accepts an array of options that include file paths/globs for targetting specific files to impact. To support both esm modules and commonjs modules, combine the two previous examples.

```json
{
  "plugins": ["@essex/eslint-plugin"],
  "rules": {
    "@essex/extensions": [
      "error",
      [
        {
          "files": ["**/*.{ts,tsx,mts,js,jsx,mjs}"],
          "expectedExtensions": [".js"]
        },
        {
          "files": ["**/*.{cts,cjs}"],
          "expectedExtensions": [],
          "disallowedExtensions": [".js"]
        }
      ]
    ]
  }
}
```

### Other file extensions

Suppose the project is using a transpiler that supports importing other file types such as images or file extensions. To support this use case in esm modules, add the additional file extensions to the `expectedExtensions` list.

```json
{
  "plugins": ["@essex/eslint-plugin"],
  "rules": {
    "@essex/extensions": [
      "error",
      [
        {
          "files": ["**/*.{ts,tsx,mts,js,jsx,mjs}"],
          "expectedExtensions": [".js", ".png", ".css"]
        },
        {
          "files": ["**/*.{cts,cjs}"],
          "expectedExtensions": [],
          "disallowedExtensions": [".js"]
        }
      ]
    ]
  }
}
```

### Typescript paths

By default, [Typescript paths](https://www.typescriptlang.org/tsconfig#paths) are considered global/external imports and therefore not impacted by this rule.

For example, the following import in a esm module will evade detection from this rule despite missing a file extension.

```js
// myModule.mjs
import { MyComponent } from '~components/MyComponent'
```

when paired with the following tsconfig setting

```json
{
  "compilerOptions": {
    "paths": {
      "~components/*": ["./src/components/*"]
    }
  }
}
```

There are two steps to supporting Typescript paths with this rule.

1. Be consistent. Always use the same symbol to prefix ts paths such as `~`.
2. Include the symbol in the `relativeModulePrefixes` list, e.g., `["./", "~"]`

With `relativeModulePrefixes` set to `["./", "~"]`, imports/exports using ts paths will be picked up by this rule and expected to use an acceptable file extension.

### Full example

```json
{
  "plugins": ["@essex/eslint-plugin"],
  "rules": {
    "@essex/extensions": [
      "error",
      [
        {
          "files": ["**/*.{ts,tsx,mts,js,jsx,mjs}"],
          "relativeModulePrefixes": ["./", "~"],
          "expectedExtensions": [".js", ".png", ".css"]
        },
        {
          "files": ["**/*.{cts,cjs}"],
          "expectedExtensions": [],
          "disallowedExtensions": [".js", ".ts", ".cjs", ".mjs", ".cts", ".mts"]
        }
      ]
    ]
  }
}
```

#### Passing samples

```js
// myModule.mjs
import 'global.css`
import styles from 'local.module.css`
import path from 'path'
import { something } from 'external-module'
import { someFunction } from '../utils/func.js'
import { MyComponent } from '~components/MyComponent.js'
import { hooks } from '~components/MyComponent.hooks.js'
```

```js
// myModule.cts
import 'global.css`
import styles from 'local.module.css`
import path from 'path'
import { something } from 'external-module'
import { someFunction } from '../utils/func'
import { MyComponent } from '~components/MyComponent'
import { hooks } from '~components/MyComponent.hooks'
```

> Notice that the commonjs example uses the `.css` file extension and the nested file path `.hooks`. Since neither `.css` or `.hooks` are listed in the `disallowedExtensions` list they will not raise any eslint errors.

#### Failing samples

```js
// myModule.mjs
import { someFunction } from '../utils/func.ts'
import { MyComponent } from '~components/MyComponent'
import { hooks } from '~components/MyComponent.hooks'
```

```js
// myModule.cts
import { someFunction } from '../utils/func.js'
import { MyComponent } from '~components/MyComponent.js'
import { hooks } from '~components/MyComponent.hooks.js'
```
