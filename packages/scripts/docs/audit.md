# > essex audit

Performs static dependency analysis

# Details & Customization

The following checks are performed when this command is invoked.

- ## audit-ci

  ### Purpose

  This tool will check for CVEs on any dependencies of the project. Any dependency with a **high** or **critical** level CVE that have not been [explicitly allowed](https://github.com/IBM/audit-ci#options) will emit an error.

  When possible, use the following priority to minimize allowlist coverage:

  <!--alex disable whitelist-->
  <!--alex disable whitelisted-->

  1. `path-whitelist`
  1. `advisories`
  1. `whitelist`
     <!--alex enable whitelist-->
     <!--alex enable whitelisted-->

- ## license-to-fail

  ### Purpose

  This tool performs basic license verification against a list of known licenses. Unknown licenses will emit a warning.

  ### Customization

  - `<rootDir>/.audit-ci.js`<br/>
    This file can export an audit-ci configuration to use for your project. See [audit-ci](https://github.com/IBM/audit-ci/#example-config-file-and-different-directory-usage) for configuration details.

  - `<rootDir>/licenses-to-fail-config.js`<br/>
    This file can export a list of allowed licenses for your project in addition to the default allowed set of this tool. (See licenses-to-fail documentation)

    ```js
    /* allowedLicenses.js */
    module.exports = ['MIT-X']
    ```
