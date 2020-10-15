/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as webpack from 'webpack'
import * as Server from 'webpack-dev-server'
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
					const compiler = webpack(wpConfig)
					const port = wpConfig?.devServer?.port || DEFAULT_PORT
					const host = wpConfig?.devServer?.host || DEFAULT_HOST

					const server = new Server(compiler as any, wpConfig.devServer)
					server.listen(port, host, (err?: Error | undefined) => {
						if (err) {
							console.log(`error listening`, err)
							reject(err)
						}
					})
					function finish(signal: string) {
						return function handleSignal() {
							console.log(`received exit signal (${signal}), shutting down...`)
							server.close(() => {
								resolve()
								process.exit()
							})
						}
					}
					EXIT_SIGNALS.forEach(finish)
				} catch (err) {
					console.log('error running webpack serve', err)
					reject(err)
				}
			}),
	)
}

const EXIT_SIGNALS: string[] = ['SIGINT', 'SIGTERM']
