/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WdsConfiguration } from 'webpack-dev-server'
import { ConfigurationManager } from './inputConfig/index.js'
import { log } from './log.js'
import {
	getResolvePlugins,
	tsRule,
	getStyleRules,
	getWdsConfig,
	getMode,
	getOutput,
	getPlugins,
} from './outputConfig/index.js'
import type { Configuration } from './types.js'

export function configure(config: Configuration = {}): WebpackConfiguration & {
	devServer: WdsConfiguration
} {
	const mgr = new ConfigurationManager(config)
	const standardModulePaths = ['node_modules']

	const result: WebpackConfiguration & { devServer: any } = {
		mode: getMode(mgr.isDevelopment),
		entry: mgr.indexFile,
		devtool: 'cheap-module-source-map',
		output: getOutput(mgr.extendedOutput),
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
