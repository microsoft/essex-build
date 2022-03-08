/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { loadJson } from '@essex/babel-config/resolve'
import { existsSync } from 'fs'
import { join } from 'path'

import type { BabelSpecification } from './createBabelConfig.js'
import { createBabelConfig } from './createBabelConfig.js'
import { getBrowsersList } from './getBrowsersList.js'

export * from './createBabelConfig.js'

const cwd = process.cwd()
const packageJsonPath = join(cwd, 'package.json')
const packageJson = existsSync('package.json') ? loadJson(packageJsonPath) : {}
const babelEsmOverride = join(cwd, 'babel.esm.js')
const babelCjsOverride = join(cwd, 'babel.cjs.js')

const useBuiltIns = packageJson.useBuiltIns || 'usage'
const corejs = packageJson.corejs || (useBuiltIns ? { version: 3 } : undefined)

/**
 * Gets the babel CJS configuration
 * @param env The babel env to use
 */
export function getCjsConfiguration(
	env: string,
	spec: Partial<BabelSpecification> = {},
): any {
	// ALlows users to override default cjs emission
	// during build by defining 'babel.cjs.js'
	if (existsSync(babelCjsOverride)) {
		return loadJson(babelCjsOverride)
	}
	return createBabelConfig({
		modules: 'cjs',
		targets: getBrowsersList(env, packageJson.browserslist),
		useBuiltIns,
		corejs,
		...spec,
	})
}

/**
 * Gets the babel ESM configuration
 * @param env The babel env to use
 */
export function getEsmConfiguration(
	env: string,
	spec: Partial<BabelSpecification> = {},
): any {
	// ALlows users to override default esm emission
	// during build by defining 'babel.esm.js'
	if (existsSync(babelEsmOverride)) {
		return loadJson(babelEsmOverride)
	}
	return createBabelConfig({
		modules: 'esm',
		targets: getBrowsersList(env, packageJson.browserslist),
		useBuiltIns,
		corejs,
		...spec,
	})
}

/**
 * Gets node-compatible configuration to use
 * with the current node version that supports
 * TypeScript & React. Usable for Jest testing.
 */
export function getNodeConfiguration(
	spec: Partial<BabelSpecification> = {},
): any {
	return createBabelConfig({
		modules: 'cjs',
		targets: { node: 'current' },
		presets: [
			require('@babel/preset-typescript'),
			require('@babel/preset-react'),
		],
		...spec,
	})
}
