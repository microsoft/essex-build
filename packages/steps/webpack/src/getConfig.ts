/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { configure } from '@essex/webpack-config'
import { Configuration } from 'webpack'
import { WebpackCompilerOptions } from './types'

const webpackConfigFile = join(process.cwd(), 'webpack.config.js')

export function getConfig({
	env,
	mode,
}: WebpackCompilerOptions): Configuration & { devServer?: any } {
	if (existsSync(webpackConfigFile)) {
		return require(webpackConfigFile)
	} else {
		return configure({ env, mode })
	}
}
