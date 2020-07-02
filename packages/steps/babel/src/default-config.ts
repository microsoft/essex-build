/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as path from 'path'
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const packageJson = require(path.join(process.cwd(), 'package.json'))
const browsers = packageJson.browserslist || ['> 0.25%, not dead']
const useBuiltIns = packageJson.useBuiltIns || false
const corejs = packageJson.corejs || (useBuiltIns ? { version: 3 } : undefined)

function createBabelConfig(modules: 'cjs' | false) {
	return {
		presets: [
			[
				require('@babel/preset-env'),
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
			require('@babel/plugin-proposal-class-properties'),
			require('@babel/plugin-proposal-object-rest-spread'),
			require('@babel/plugin-proposal-optional-chaining'),
			require('@babel/plugin-proposal-nullish-coalescing-operator'),
		],
	} as any
}

export const babelCjs = createBabelConfig('cjs')
export const babelEsm = createBabelConfig(false)
