/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const fs = require('fs')
const path = require('path')
const cwd = process.cwd()
const licensesPath = path.join(cwd, 'licenses-to-fail-config.js')
const customConfig = fs.existsSync(licensesPath) ? require(licensesPath) : {}
const {
	allowedLicenses = [],
	allowedPackages = [],
	...otherConfig
} = customConfig

module.exports = {
	warnOnUnknown: true,
	allowedLicenses: [
		'MIT',
		'ISC',
		'Apache 2',
		'Apache-2.0',
		'BSD',
		'BSD-2-Clause',
		'BSD-3-Clause',
		'0BSD',
		'MPL-2.0',
		'Unlicense',
		'public domain',
		'DBAD',
		'WTFPL',

		// Art & Creative-Commons Licenses
		'Artistic-2.0',
		'CC0-1.0',
		'CC-BY-2.0',
		'CC-BY-3.0',
		'CC-BY-4.0',

		// Data Licenses
		'ODC-By-1.0',
		...allowedLicenses,
	],
	allowedPackages: [
		{
			name: 'memfs',
		},
		{
			name: 'fs-monkey',
		},
		...allowedPackages,
	],
	...otherConfig,
}
