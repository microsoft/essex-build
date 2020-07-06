/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import webpack = require('webpack')
import { configure } from '@essex/webpack-config'

const webpackConfigFile = join(process.cwd(), 'webpack.config.js')

/**
 * Gets a webpack compiler instance
 * @param config The compiler configuration
 */
export function getCompiler(config: WebpackCompilerOptions): webpack.Compiler {
	return webpack(getWebpcakConfig(config))
}

export interface WebpackCompilerOptions {
	env?: string
	mode?: string
}

function getWebpcakConfig(config: WebpackCompilerOptions) {
	if (existsSync(webpackConfigFile)) {
		return require(webpackConfigFile)
	} else {
		return configure(config)
	}
}
