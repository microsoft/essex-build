/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import webpack from 'webpack'
import Server from 'webpack-dev-server'

import { getConfig } from './getConfig.mjs'
import type { WebpackCompilerOptions } from './types.mjs'

const DEFAULT_PORT = 8080
const DEFAULT_HOST = '0.0.0.0'

export function webpackServe({
	env,
	mode,
}: WebpackCompilerOptions): Promise<void> {
	return Promise.resolve().then(
		() =>
			new Promise((resolve, reject) => {
				try {
					const wpConfig = getConfig({ env, mode })
					const compiler = webpack(wpConfig)
					const port = wpConfig?.devServer?.port || DEFAULT_PORT
					const host = wpConfig?.devServer?.host || DEFAULT_HOST
					if (!wpConfig.devServer) {
						throw new Error('webpack config missing devServer')
					}

					/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
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
