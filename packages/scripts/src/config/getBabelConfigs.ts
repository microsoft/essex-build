/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import { createBabelConfig } from './createBabelConfig'
import { getBrowsersList } from './getBrowsersList'

const cwd = process.cwd()
const packageJsonPath = join(cwd, 'package.json')
const packageJson = require(packageJsonPath)

export function getBabelConfigs(env: string): [any, any] {
	const browserslist = getBrowsersList(env, packageJson.browserslist)
	const useBuiltIns = packageJson.useBuiltIns || false
	const corejs =
		packageJson.corejs || (useBuiltIns ? { version: 3 } : undefined)

	const babelEsmConfig = createBabelConfig(
		'esm',
		browserslist,
		useBuiltIns,
		corejs,
	)
	const babelCjsConfig = createBabelConfig(
		'cjs',
		browserslist,
		useBuiltIns,
		corejs,
	)

	return [babelEsmConfig, babelCjsConfig]
}
