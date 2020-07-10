/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
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

	const sum = (a: number, b: number) => a + b
	const errorCount = results.map(r => r.errorCount).reduce(sum, 0)
	const warningCount = results.map(r => r.warningCount).reduce(sum, 0)
	if (errorCount > 0) {
		return Promise.reject('eslint failed')
	}
	if (strict && warningCount > 0) {
		return Promise.reject('eslint failed')
	}
}
