/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const fs = require('fs')
const cwd = process.cwd()
const licensesPath = process.join(cwd, 'allowedLicenses.js')
const extraLicenses = fs.existsSync(licensesPath) ? require(licensesPath) : []

module.exports = {
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
		// Art & Creative-Commons Licenses
		'Artistic-2.0',
		'CC0-1.0',
		'CC-BY-2.0',
		'CC-BY-3.0',
		'CC-BY-4.0',
		...extraLicenses,
	],
	warnOnUnknown: true,
}
