/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import webpack = require('webpack')
import { getCompiler } from './getCompiler'
import { WebpackCompilerOptions } from './types'

export function webpackBuild(config: WebpackCompilerOptions): Promise<number> {
	return new Promise((resolve, reject) => {
		const compiler = getCompiler(config)
		compiler.run((err: Error, stats: webpack.Stats) => {
			console.log(stats.toString({ colors: true }))
			if (err || stats.hasErrors()) {
				console.error('webpack error', err)
				resolve(1)
			} else {
				resolve(0)
			}
		})
	})
}
