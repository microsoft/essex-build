/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import '@typescript-eslint/eslint-plugin'
import '@typescript-eslint/parser'
import 'babel-eslint'
import 'eslint-config-prettier'
import 'eslint-plugin-flowtype'
import 'eslint-plugin-header'
import 'eslint-plugin-import'
import 'eslint-plugin-jest'
import 'eslint-plugin-jsx-a11y'
import 'eslint-plugin-prettier'
import 'eslint-plugin-react'
import 'eslint-plugin-react-hooks'
import '@essex/eslint-plugin'
import '@essex/eslint-config'

import { existsSync } from 'fs'
import { join } from 'path'
import { ESLint } from 'eslint'

const releaseConfig = join(__dirname, '../config/.eslintrc-release')
const experimentConfig = join(__dirname, '../config/.eslintrc-experiment')
const projectConfig = join(process.cwd(), '.eslintrc')

const defaultIgnore = join(__dirname, '../config/.eslintignore')
const projectIgnore = join(process.cwd(), '.eslintignore')
const ignorePath = existsSync(projectIgnore) ? projectIgnore : defaultIgnore

export async function eslint(fix: boolean, strict: boolean): Promise<void> {
	const pluginPath = join(__dirname, '..', '..')
	let configFile = experimentConfig
	if (existsSync(projectConfig)) {
		configFile = projectConfig
	} else if (strict) {
		configFile = releaseConfig
	}

	const linter = new ESLint({
		fix,
		overrideConfigFile: configFile,
		resolvePluginsRelativeTo: pluginPath,
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		ignorePath,
	})
	const results = await linter.lintFiles(['.'])

	await ESLint.outputFixes(results)
	const formatter = await linter.loadFormatter('stylish')
	const resultText = formatter.format(results)
	console.log(resultText)
}
