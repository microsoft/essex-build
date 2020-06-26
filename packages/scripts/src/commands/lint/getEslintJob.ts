/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	getConfigPath,
	RunArg,
	getProjectPath,
	getEssexScriptsPathSync,
} from '../../utils'

async function getEslintArgs(
	configPath: string,
	fix: boolean,
	strict: boolean,
	fileglob: string[] = ['.'],
): Promise<string[]> {
	const ignoreFilePath = await getProjectPath(
		'.eslintignore',
		getEssexScriptsPathSync('.eslintignore', false)!,
	)

	const result = [`--config=${configPath}`, `--ignore-path=${ignoreFilePath!}`]
	if (fix) {
		result.push('--fix')
	}
	if (strict) {
		result.push('--max-warnings', '0')
	}
	result.push('--ext', '.js,.ts,.jsx,.tsx', ...fileglob)
	return result
}

export async function getEslintJob(
	fix: boolean,
	strict: boolean,
): Promise<RunArg> {
	const configPath = await getConfigPath(
		'.eslintrc',
		strict ? '.eslintrc-release' : '.eslintrc-experiment',
	)
	const args = await getEslintArgs(configPath!, fix, strict)
	return { exec: 'eslint', args, codeMap: { 2: 0 } }
}
