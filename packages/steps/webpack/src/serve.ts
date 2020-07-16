/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as Server from 'webpack-dev-server'
import { getCompiler } from './getCompiler'
import { getConfig } from './getConfig'
import { WebpackCompilerOptions } from './types'

const DEFAULT_PORT = 8080
const DEFAULT_HOST = '0.0.0.0'

export function webpackServe(config: WebpackCompilerOptions): Promise<number> {
	return new Promise((resolve, reject) => {
		try {
			const wpConfig = getConfig(config)
			const compiler = getCompiler(config)
			const port = wpConfig?.devServer?.port || DEFAULT_PORT
			const host = wpConfig?.devServer?.host || DEFAULT_HOST

			const server = new Server(compiler)
			server.listen(port, host, (err?: Error | undefined) => {
				if (err) {
					console.error(`error listening`, err)
					reject(err)
				}
			})
		} catch (err) {
			console.log('eror running webpack serve', err)
			reject(err)
		}
	})
}
