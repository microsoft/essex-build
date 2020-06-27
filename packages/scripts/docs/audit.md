# > essex audit

Performs static dependency analysis

# Details & Customization

The following checks are performed when this command is invoked.

- ## audit-ci

  ### Purpose

  This tool will check for CVEs on any dependencies of the project. Any dependency with a **high** or **critical** level CVE that have not been [explicitly allowed](https://github.com/IBM/audit-ci#options) will emit an error.

  When possible, use the following priority to minimize allowlist coverage:


  1. `path` (e.g. `123|example-module`)
  1. `advisories` (e.g. `123`)
  1. `modules` (e.g. `example-module`)

- ## license-to-fail

  ### Purpose

  This tool performs basic license verification against a list of known licenses. Unknown licenses will emit a warning.

  ### Customization

  - `<rootDir>/.audit-ci.js`<br/>
    This file can export an audit-ci configuration to use for your project. See [audit-ci](https://github.com/IBM/audit-ci/#example-config-file-and-different-directory-usage) for configuration details.

  - `<rootDir>/allowedLicenses.js`<br/>
    This file can export a list of allowed licenses for your project in addition to the default allowed set of this tool. (See the configuration file for details)

    ```js
    /* allowedLicenses.js */
    module.exports = ['MIT-X']
    ```
