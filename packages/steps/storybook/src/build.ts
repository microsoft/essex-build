/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { gulpify, filterShellCode } from '@essex/build-utils'
import { run } from '@essex/shellrunner'

const cwd = process.cwd()
const defaultPath = join(__dirname, '../config/.storybook')
const overridePath = join(cwd, '.storybook')
const configPath = existsSync(overridePath) ? overridePath : defaultPath

export function storybookBuild(verbose: boolean): Promise<void> {
	const args: string[] = ['-c', configPath]
	if (!verbose) {
		args.push('--quiet')
	}
	return run({
		exec: 'build-storybook',
		args,
	}).then(filterShellCode)
}

export const storybookBuildGulp = gulpify('storybook', storybookBuild)
