/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require(`path`)
const root = path.dirname(__dirname)

const CONFIG = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: 'cjs',
				targets: { node: 'current' },
				useBuiltIns: 'usage',
				corejs: 3,
			},
		],
		'@babel/preset-typescript',
	],
}

require(`@babel/register`)({
	root,
	extensions: [`.tsx`, `.ts`],
	only: [p => p.startsWith(root)],
	...CONFIG,
})

// The babel configuration is required at the monorepo root for Jest. Jest will
// automatically use this configuration to process JavaScript and TypeScript
// sources by default. These plugins should be installed as devDependencies at
// the jest testing root, usually the root of the monorepo, in addition to
// @babel/core
module.exports = CONFIG
