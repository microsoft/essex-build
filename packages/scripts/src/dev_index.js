#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require(`path`)
// lots of dot-dots to hoist out of the .yarn folder
const root = path.dirname(path.join(__dirname, '../../../../../..'))

require(`@babel/register`)({
	root,
	extensions: [`.tsx`, `.ts`],
	only: [p => p.startsWith(root)],
	presets: [
		[
			require.resolve('@babel/preset-env'),
			{
				targets: { node: 'current' },
			},
		],
		require.resolve('@babel/preset-typescript'),
	],
})

require('./entry')
