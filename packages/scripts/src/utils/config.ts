/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { exists } from 'fs'
import { getProjectPath, getEssexScriptsPathSync } from './paths'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type PackageJson = any

/**
 * package.json path of the client. This is expected to exist.
 */
export const getReadmePath = (): Promise<string> =>
	getProjectPath('README.md', false) as Promise<string>

/**
 * package.json path of the client. This is expected to exist.
 */
export const getPackageJsonPath = (): Promise<string> =>
	getProjectPath('package.json', false) as Promise<string>

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

export const getStorybookConfigPath = (): Promise<string> =>
	getProjectPath(
		'.storybook',
		getEssexScriptsPathSync('.storybook', false),
	) as Promise<string>

/**
 * Babel ESM configuration path - may be overriden by the client
 */
const BABEL_ESM_FILENAME = 'babelrc.esm.js'
export const getBabelEsmConfigPath = (): Promise<string> =>
	getProjectPath(
		BABEL_ESM_FILENAME,
		getEssexScriptsPathSync(BABEL_ESM_FILENAME),
	) as Promise<string>

/**
 * Babel CJS configuration path - may be overriden by the client
 */
const BABEL_CJS_FILENAME = 'babelrc.cjs.js'
export const getBabelCjsConfigPath = (): Promise<string> =>
	getProjectPath(
		BABEL_CJS_FILENAME,
		getEssexScriptsPathSync(BABEL_CJS_FILENAME),
	) as Promise<string>

export function getPackageJSON(): Promise<PackageJson> {
	return getPackageJsonPath().then(pkgPath => {
		return new Promise(resolve => {
			exists(pkgPath, is => {
				resolve(is ? require(pkgPath) : {})
			})
		})
	})
}
