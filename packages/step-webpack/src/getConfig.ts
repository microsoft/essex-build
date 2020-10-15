/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { Configuration } from 'webpack'
import { Configuration as WdsConfiguration } from 'webpack-dev-server'
import { WebpackCompilerOptions } from './types'
import { configure } from '@essex/webpack-config'

const webpackConfigFile = join(process.cwd(), 'webpack.config.js')

export function getConfig({
	env,
	mode,
}: WebpackCompilerOptions): Configuration & { devServer?: WdsConfiguration } {
	if (existsSync(webpackConfigFile)) {
		return require(webpackConfigFile)
	} else {
		return configure({ env, mode })
	}
}
