/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gulpify } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as webpack from 'webpack'
import { getCompiler } from './getCompiler'
import { WebpackCompilerOptions } from './types'

export function webpackBuild(config: WebpackCompilerOptions): Promise<void> {
	try {
		const compiler = getCompiler(config)
		return new Promise((resolve, reject) => {
			compiler.run((err: Error, stats: webpack.Stats) => {
				console.log(stats.toString({ colors: true }))
				if (err || stats.hasErrors()) {
					console.log('webpack error', err)
					subtaskFail('webpack')
					reject(err)
				} else {
					subtaskSuccess('webpack')
					resolve()
				}
			})
		})
	} catch (err) {
		console.log('error running webpack build', err)
		return Promise.reject(err)
	}
}

export const webpackBuildGulp = gulpify('webpack', webpackBuild)
