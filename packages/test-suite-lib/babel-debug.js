/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * debug config for build-infra config
 */

const path = require(`path`)
const root = path.dirname(path.join(__dirname, '../..'))
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
