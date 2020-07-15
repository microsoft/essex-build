/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { exists } from 'fs'
import { getProjectPath, getEssexScriptsPathSync } from './paths'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type PackageJson = any

/**
 * tsconfig.json path of the client. Its existence is optional
 */
export const getTsConfigJsonPath = (): Promise<string> =>
	getProjectPath('tsconfig.json', false) as Promise<string>

/**
 * Rollup config path of the client. Its existence is optional.
 */
export const getRollupConfigPath = (): Promise<string> =>
	getProjectPath('rollup.config.js', false) as Promise<string>

/**
 * Gets the webpack config path to use for build command. This may not exist, and
 * bundling will be skipped if does not exist
 */
export const getWebpackConfigPath = (): Promise<string> =>
	getProjectPath('webpack.config.js', false) as Promise<string>

/**
 * Gets the webpack config to use for the bundle/serve commands. This may or may not exist,
 * and if it does not we will fall back on our default configuration.
 */
export const getWebpackBundleConfigPath = (): Promise<string> =>
	getProjectPath(
		'webpack.config.js',
		getEssexScriptsPathSync('webpack.config.js', false),
	) as Promise<string>
