# > essex check

Performs static checks over a project. Run `essex check --help` for all options.

# CLI Options

- `--strict`<br/> enable strict checks. Warnings will result in a non-zero exit code.

# Details & Customization

The following static verification checks are performed when this command is invoked.

- ## eslint

  ### Purpose

  eslint performs static analysis of our JavaScript and TypeScript files to verify that they align with our expected idioms, and to prevent subtle errors from entering our source code.

  ### Customization

  - `<rootDir>/.eslintrc`<br/>
    `<rootDir>/.eslintignore`<br/>
    Linting configuration may be overridden by defining this file. By default the `plugin:@essex/experiment` preset will be used for linting. Details on that preset can be found in this repository under `packages/eslint-config`. Essex projects should have an .eslintrc file that extends from `@essex/experiment` and enables or disables certain rules. This ruleset disables stylistic rules, and allows prettier-based tooling to manage those.

- ## pretty-quick

  ### Purpose

  prettier performs automated code formatting. This check verifies that all code in the repository **would not be altered** by the formatter. This is useful in CI scenarios where we want to verify that all the source code matches our agreed-upon formatting specifications.

  ### Customization

  - `<rootDir>/.prettierrc` or `package.json::prettier`<br/>
    Prettier can be configured using these standard vectors. Essex projects should use the default Essex prettier configuration

    ```json
    /* package.json */
    "prettier": "@essex/prettier-config"
    ```

### rome

### Purpose

rome is a modern linter and formatter. It can be used in essex scripts as the configured formatter.

### Customization

-`<rootDir>/rome.json`, see [rome docs](https://rome.tools) for configuration details.