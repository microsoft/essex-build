/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import webpack = require('webpack')
import { getCompiler, WebpackCompilerOptions } from './getCompiler'

export function webpackBuild(config: WebpackCompilerOptions): Promise<number> {
	return new Promise((resolve, reject) => {
		const compiler = getCompiler(config)
		compiler.run((err: Error, stats: webpack.Stats) => {
			if (err) {
				console.error('webpack error', err)
				resolve(1)
			} else {
				resolve(0)
			}
		})
	})
}
