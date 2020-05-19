# > essex audit

Performs static dependency analysis

# Details & Customization

The following checks are performed when this command is invoked.

- ## audit-ci -h -c

  ### Purpose

  This tool will check for CVEs on any dependencies of the project. Any dependency with a **high** or **critical** level CVE will emit an error.

- ## license-to-fail

  ### Purpose

  This tool performs basic license verification against a list of known licenses. Unknown licenses will emit a warning.

  ### Customization

  - `<rootDir>/allowedLicenses.js`<br/>
    This file can export a list of allowed licenses for your project in addition to the default allowed set of this tool. (See the configuration file for details)

    ```js
    /* allowedLicenses.js */
    module.exports = ['MIT-X']
    ```
