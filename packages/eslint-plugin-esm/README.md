# eslint-plugin-esm

A collection of eslint rules for esm modules.

## Install

```bash
$ npm install eslint-plugin-esm -D
```

## Configure

**.eslintrc.json**

```
{
  "plugins": ["esm"],
  "rules": {
    "esm/extensions": "error"
  }
}
```

## Rules

- [extensions](docs/rules/extensions.md) - Enforce the use of file extensions in import/export paths within esm modules or prevent the use of file extensions in import/export paths within commonjs modules.
