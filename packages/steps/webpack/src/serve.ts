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

export function webpackServe({
	env,
	mode,
	verbose,
}: WebpackCompilerOptions): Promise<void> {
	return Promise.resolve().then(
		() =>
			new Promise((resolve, reject) => {
				try {
					const wpConfig = getConfig({ env, mode, verbose })
					const compiler = getCompiler({ env, mode, verbose })
					const port = wpConfig?.devServer?.port || DEFAULT_PORT
					const host = wpConfig?.devServer?.host || DEFAULT_HOST

					const server = new Server(compiler, wpConfig.devServer)
					server.listen(port, host, (err?: Error | undefined) => {
						if (err) {
							console.log(`error listening`, err)
							reject(err)
						}
					})
					function finish() {
						server.close()
						resolve()
					}
					process.on('SIGINT', finish)
					process.on('SIGTERM', finish)
				} catch (err) {
					console.log('eror running webpack serve', err)
					reject(err)
				}
			}),
	)
}
