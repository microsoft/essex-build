/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function createBabelConfig(
	modules: 'cjs' | 'esm',
	targets: string | string[] | Record<string, string>,
	useBuiltIns: boolean,
	corejs: undefined | { version: number },
): any {
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
		],
	} as any
}
