/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function createBabelConfig(
	modules: 'cjs' | 'esm',
	browsers: string[],
	useBuiltIns: boolean,
	corejs: undefined | { version: number },
): any {
	return {
		presets: [
			[
				require('@babel/preset-env'),
				{
					modules: modules === 'cjs' ? 'cjs' : false,
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
