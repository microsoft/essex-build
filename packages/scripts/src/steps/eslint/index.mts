/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ESLint } from 'eslint'
import { createRequire } from 'module'

import { getConfigFile, getIgnorePath } from './config.mjs'

const require = createRequire(import.meta.url)

export async function eslint(
	fix: boolean | undefined,
	strict: boolean | undefined,
	files: string[] = ['.'],
): Promise<void> {
	try {
		const configFile = getConfigFile()
		const ignorePath = getIgnorePath()
		const linter = new ESLint({
			fix,
			overrideConfigFile: configFile,
			resolvePluginsRelativeTo: require
				.resolve('@essex/eslint-plugin')
				.replace('lib/index.js', ''),
			extensions: ['js', 'jsx', 'ts', 'tsx', 'mts', 'cts'],
			ignorePath,
		})

		const results = await linter.lintFiles(files)
		await ESLint.outputFixes(results)
		const formatter = await linter.loadFormatter('stylish')
		const resultText = formatter.format(results)
		console.log(resultText)

		const sum = (a: number, b: number) => a + b
		const errorCount = results.map((r) => r.errorCount).reduce(sum, 0)
		const warningCount = results.map((r) => r.warningCount).reduce(sum, 0)
		if (errorCount > 0) {
			return Promise.reject('eslint failed')
		}
		if (strict && warningCount > 0) {
			return Promise.reject('eslint failed')
		}
	} catch (err) {
		console.log('error running eslint', err)
		return Promise.reject(err)
	}
}
