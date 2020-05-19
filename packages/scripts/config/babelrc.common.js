/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require('path')
const packageJson = require(path.join(process.cwd(), 'package.json'))
const browsers = packageJson.browserslist || ['> 0.25%, not dead']
const useBuiltIns = packageJson.useBuiltIns || false
const corejs = packageJson.corejs || (useBuiltIns ? { version: 3 } : undefined)

module.exports = modules => ({
	presets: [
		[
			'@babel/preset-env',
			{
				modules,
				targets: {
					browsers,
				},
				useBuiltIns,
				corejs,
			},
		],
	],
	plugins: [
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-nullish-coalescing-operator',
	],
})
