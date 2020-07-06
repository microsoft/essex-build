/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { WebpackCompilerOptions } from './types'
import { configure } from '@essex/webpack-config'

const webpackConfigFile = join(process.cwd(), 'webpack.config.js')

export function getConfig(config: WebpackCompilerOptions): any {
	if (existsSync(webpackConfigFile)) {
		return require(webpackConfigFile)
	} else {
		return configure(config as any)
	}
}
