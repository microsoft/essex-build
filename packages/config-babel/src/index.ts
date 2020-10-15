/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { createBabelConfig } from './createBabelConfig'
import { getBrowsersList } from './getBrowsersList'

const cwd = process.cwd()
const packageJsonPath = join(cwd, 'package.json')
const packageJson = existsSync('package.json') ? require(packageJsonPath) : {}
const babelEsmOverride = join(cwd, 'babelrc.esm.js')
const babelCjsOverride = join(cwd, 'babelrc.cjs.js')

const useBuiltIns = packageJson.useBuiltIns || false
const corejs = packageJson.corejs || (useBuiltIns ? { version: 3 } : undefined)

/**
 * Gets the babel CJS configuration
 * @param env The babel env to use
 */
export function getCjsConfiguration(env: string): any {
	if (existsSync(babelCjsOverride)) {
		return require(babelCjsOverride)
	}
	return createBabelConfig(
		'cjs',
		getBrowsersList(env, packageJson.browserslist),
		useBuiltIns,
		corejs,
	)
}

/**
 * Gets the babel ESM configuration
 * @param env The babel env to use
 */
export function getEsmConfiguration(env: string): any {
	if (existsSync(babelEsmOverride)) {
		return require(babelEsmOverride)
	}
	return createBabelConfig(
		'esm',
		getBrowsersList(env, packageJson.browserslist),
		useBuiltIns,
		corejs,
	)
}
