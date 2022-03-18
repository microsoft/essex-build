/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configure } from '@essex/webpack-config'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { join } from 'path'
import type { Configuration } from 'webpack'
import type { Configuration as WdsConfiguration } from 'webpack-dev-server'

import type { WebpackCompilerOptions } from './types.mjs'

const require = createRequire(import.meta.url)

export type WebpackConfigWithWDS = Configuration & {
	devServer?: WdsConfiguration
}

export function getConfig({
	env,
	mode,
}: WebpackCompilerOptions): WebpackConfigWithWDS {
	const webpackConfigFile = join(process.cwd(), 'webpack.config.js')
	if (existsSync(webpackConfigFile)) {
		return require(webpackConfigFile) as WebpackConfigWithWDS
	} else {
		return configure({ env, mode })
	}
}
