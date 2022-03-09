/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import type { Configuration } from 'webpack'

export function getOutput(extend: any): Configuration['output'] {
	const buildPath = join(process.cwd(), 'build/')
	return {
		path: buildPath,
		chunkFilename: '[name].[chunkhash].js',
		filename: '[name].[fullhash].js',
		...extend,
	} as Configuration['output']
}
