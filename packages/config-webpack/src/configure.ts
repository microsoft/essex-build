/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WdsConfiguration } from 'webpack-dev-server'

import { ConfigurationManager } from './inputConfig/index.js'
import { log } from './log.js'
import {
	getMode,
	getOutput,
	getPlugins,
	getResolvePlugins,
	getStyleRules,
	getWdsConfig,
	tsRule,
} from './outputConfig/index.js'
import type { Configuration } from './types.js'

export function configure(config: Configuration = {}): WebpackConfiguration & {
	devServer: WdsConfiguration
} {
	// Check for ambient env/mode settings from @essex/scripts
	if (config.env == null) {
		config.env = process.env.__ESSEX_WEBPACK_CONFIG_ENV as string
	}
	if (config.mode == null) {
		const mode = process.env.__ESSEX_WEBPACK_CONFIG_MODE as string
		if (mode !== 'development' && mode !== 'production') {
			throw new Error(
				`invalid mode ${mode}; it must be either "development" or "production"`,
			)
		}
		config.mode = mode
	}

	const mgr = new ConfigurationManager(config)
	const standardModulePaths = ['node_modules']

	const result: WebpackConfiguration & { devServer: any } = {
		mode: getMode(mgr.isDevelopment),
		entry: mgr.indexFile,
		devtool: 'cheap-module-source-map',
		output: getOutput(mgr.extendedOutput),
		resolve: {
			extensions: [
				'.ts',
				'.js',
				'.tsx',
				'.jsx',
				'.mts',
				'.mjs',
				'.cts',
				'.cjs',
			],
			extensionAlias: {
				'.js': ['.ts', '.js', '.tsx', '.jsx'],
				'.mjs': ['mts', '.mjs'],
				'.cjs': ['cts', '.cjs'],
			},
			modules: [...standardModulePaths, ...mgr.extendedResolveModules],
			alias: mgr.extendedAlias,
			plugins: getResolvePlugins(mgr.useTsConfigPaths),
		},
		resolveLoader: {
			modules: [...standardModulePaths, ...mgr.extendedResolveLoaderModules],
		},
		module: {
			rules: [tsRule, ...getStyleRules(mgr.isDevelopment)],
		},
		devServer: getWdsConfig(mgr.extendedDevServer),
		plugins: getPlugins(mgr),
	}

	log('final webpack configuration', result)
	return result
}
