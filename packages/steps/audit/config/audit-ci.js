/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { existsSync } = require('fs')
const { join } = require('path')
const debug = require('debug')
const log = debug('essex:audit')
const cwd = process.cwd()

const DEFAULT_CONFIG = {
	high: true,
	'path-whitelist': [],
}

const JS_DOT_OVERRIDE = join(cwd, '.audit-ci.js')
const JSON_DOT_OVERRIDE = join(cwd, '.audit-ci.json')
const JS_OVERRIDE = join(cwd, 'audit-ci.js')
const JSON_OVERRIDE = join(cwd, 'audit-ci.json')

if (existsSync(JS_DOT_OVERRIDE)) {
	log('use js dot override')
	module.exports = require(JS_DOT_OVERRIDE)
} else if (existsSync(JSON_DOT_OVERRIDE)) {
	log('use json dot override')
	module.exports = require(JSON_DOT_OVERRIDE)
} else if (existsSync(JS_OVERRIDE)) {
	log('use js override')
	module.exports = require(JS_OVERRIDE)
} else if (existsSync(JSON_OVERRIDE)) {
	log('use json override')
	module.exports = require(JSON_OVERRIDE)
} else {
	log('use default configuration')
	module.exports = DEFAULT_CONFIG
}
