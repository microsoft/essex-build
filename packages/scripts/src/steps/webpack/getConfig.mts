/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { existsSync } from 'fs'
import { join } from 'path'
import essexWebpackConfig from '@essex/webpack-config'
import debug from 'debug'
import type { Configuration } from 'webpack'
import type { Configuration as WdsConfiguration } from 'webpack-dev-server'

import type { WebpackCompilerOptions } from './types.mjs'

const log = debug('essex:webpack')

export interface WebpackConfigWithWDS extends Configuration {
	devServer?: WdsConfiguration
}

export async function getConfig({
	env,
	mode,
}: WebpackCompilerOptions): Promise<WebpackConfigWithWDS> {
	const fileOptions = [
		join(process.cwd(), 'webpack.config.js'),
		join(process.cwd(), 'webpack.config.mjs'),
		join(process.cwd(), 'webpack.config.cjs'),
	]
	const found = fileOptions.find(existsSync)

	if (found != null) {
		const webpackConfigFile = `file://${found.replaceAll('\\', '/')}`
		log('using custom webpack.config file: ', webpackConfigFile)
		// Note: this allows us to pass env and mode settings to
		// the webpack configuration library, which _may_ be used
		// by the client configruration
		process.env['__ESSEX_WEBPACK_CONFIG_ENV'] = env
		process.env['__ESSEX_WEBPACK_CONFIG_MODE'] = mode

		const module = (await import(webpackConfigFile)) as {
			default: WebpackConfigWithWDS
		}
		return module.default
	} else {
		log('using default essex webpack configuration')
		return essexWebpackConfig.configure({ env, mode })
	}
}
