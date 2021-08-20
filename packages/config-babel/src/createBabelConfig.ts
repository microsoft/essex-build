/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface BabelSpecification {
	modules: 'cjs' | 'esm'
	targets: string | string[] | Record<string, string>
	useBuiltIns?: 'usage' | 'entry' | false
	corejs?: 2 | 3 | { version: number; proposals: boolean }
	presets?: any[]
	plugins?: any[]
}
export function createBabelConfig({
	modules,
	targets,
	corejs = 3,
	useBuiltIns = 'usage',
	presets = [],
	plugins = [],
}: BabelSpecification): any {
	return {
		presets: [
			[
				require('@babel/preset-env'),
				{
					modules: modules === 'cjs' ? 'cjs' : false,
					targets,
					useBuiltIns,
					corejs,
				},
			],
			...presets,
		],
		plugins: [
			require('babel-plugin-transform-typescript-metadata'),
			require('@babel/plugin-proposal-class-properties'),
			require('@babel/plugin-proposal-object-rest-spread'),
			require('@babel/plugin-proposal-optional-chaining'),
			require('@babel/plugin-proposal-nullish-coalescing-operator'),
			...plugins,
		],
	} as any
}
