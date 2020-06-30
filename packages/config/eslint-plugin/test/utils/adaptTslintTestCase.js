/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { readFileSync } = require('fs')

/**
 * Takes a tslint test case file and turns it into a set of eslint compatible code segments, errors
 */
module.exports = function(testCasePath) {
	const errors = []
	let code = readFileSync(testCasePath).toString()
	code = code.replace(/(~+)\s+\[([^\]]+)\]/g, function(
		instance,
		errorHighlight,
		message,
		offset,
	) {
		const line = code.substring(0, offset).split('\n').length - 1
		errors.push({
			message,
			line,
		})
		return ''
	})
	return {
		code,
		errors,
	}
}
