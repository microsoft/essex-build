/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as webpack from 'webpack'
import { WebpackCompilerOptions } from './types'

export function webpackWatch(config: WebpackCompilerOptions): Promise<number> {
	return new Promise((resolve, reject) => {
		try {
			const compiler = webpack(config)
			compiler.watch(
				{
					aggregateTimeout: 500,
					ignored: /node_modules/,
				},
				(err: Error, stats: webpack.Stats) => {
					if (err) {
						console.log('webpack error', err)
						reject(err)
					}
					console.log(stats.toString({ colors: true }))
				},
			)
		} catch (err) {
			console.log('error running webpack watch', err)
			reject(err)
		}
	})
}
