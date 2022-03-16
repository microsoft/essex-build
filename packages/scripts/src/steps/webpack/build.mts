/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import webpack from 'webpack'

import { subtaskFail, subtaskSuccess } from '../../util/tasklogger.mjs'
import { getConfig } from './getConfig.mjs'
import type { WebpackCompilerOptions } from './types.mjs'

export function webpackBuild(opts: WebpackCompilerOptions): Promise<void> {
	try {
		const config = getConfig(opts)
		const compiler = webpack(config)
		return new Promise((resolve, reject) => {
			compiler.run(
				(err: Error | null | undefined, stats: webpack.Stats | undefined) => {
					if (err) {
						console.error('webpack error', err)
						subtaskFail('webpack')
						reject(err)
					} else {
						console.log(stats?.toString({ colors: true }))
						if (stats?.hasErrors()) {
							subtaskFail('webpack')
							reject('compilation errors')
						} else {
							subtaskSuccess('webpack')
							resolve()
						}
					}
				},
			)
		})
	} catch (err) {
		console.log('error running webpack build', err)
		return Promise.reject(err)
	}
}
