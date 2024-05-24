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

export async function webpackServe({
	env,
	mode,
}: WebpackCompilerOptions): Promise<void> {
	const wpConfig = await getConfig({ env, mode })
	return new Promise<void>((resolve, reject) => {
		try {
			const compiler = webpack(wpConfig)
			const port = wpConfig?.devServer?.port || DEFAULT_PORT
			const host = wpConfig?.devServer?.host || DEFAULT_HOST
			if (!wpConfig.devServer) {
				throw new Error('webpack config missing devServer')
			}

			/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
			const server = new Server(wpConfig.devServer, compiler)
			server.options.port = port
			server.options.host = host
			server.startCallback((err?: Error | undefined) => {
				if (err) {
					console.error('error listening', err)
					reject(err)
				}
			})
			function finish(signal: string) {
				return function handleSignal() {
					console.warn(`received exit signal (${signal}), shutting down...`)
					server
						.stop()
						.then(() => resolve())
						.then(() => process.exit())
				}
			}
			EXIT_SIGNALS.forEach(finish)
		} catch (err) {
			console.error('error running webpack serve', err)
			reject(err)
		}
	})
}

const EXIT_SIGNALS: string[] = ['SIGINT', 'SIGTERM']
