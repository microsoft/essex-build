/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import webpack = require('webpack')
import { getCompiler } from './getCompiler'
import { WebpackCompilerOptions } from './types'

export function webpackBuild(
	config: WebpackCompilerOptions,
): (cb: (err?: Error) => void) => void {
	return (cb: (err?: Error) => void) => {
		const compiler = getCompiler(config)
		compiler.run((err: Error, stats: webpack.Stats) => {
			console.log(stats.toString({ colors: true }))
			if (err || stats.hasErrors()) {
				subtaskFail('webpack')
				cb(err)
			} else {
				subtaskSuccess('webpack')
				cb()
			}
		})
	}
}
