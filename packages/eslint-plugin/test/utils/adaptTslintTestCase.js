/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { readFileSync } = require('node:fs')

/**
 * Takes a tslint test case file and turns it into a set of eslint compatible code segments, errors
 */
module.exports = (testCasePath) => {
	const errors = []
	let code = readFileSync(testCasePath).toString()
	code = code.replace(
		/(~+)\s+\[([^\]]+)\]/g,
		(_instance, _errorHighlight, message, offset) => {
			const line = code.substring(0, offset).split('\n').length - 1
			errors.push({
				message,
				line,
			})
			return ''
		},
	)
	return {
		code,
		errors,
	}
}
