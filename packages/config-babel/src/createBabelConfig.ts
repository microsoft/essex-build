/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import { resolve } from '@essex/babel-config/resolve'

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
				resolve('@babel/preset-env'),
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
			resolve('babel-plugin-transform-typescript-metadata'),
			resolve('@babel/plugin-proposal-class-properties'),
			resolve('@babel/plugin-proposal-object-rest-spread'),
			resolve('@babel/plugin-proposal-optional-chaining'),
			resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
			...plugins,
		],
	} as any
}
