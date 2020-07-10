/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { resolveGulpTask, filterShellCode } from '@essex/build-utils-gulp'
import { run } from '@essex/shellrunner'

const cwd = process.cwd()
const defaultPath = join(__dirname, '../config/.storybook')
const overridePath = join(cwd, '.storybook')
const configPath = existsSync(overridePath) ? overridePath : defaultPath

export function storybookBuild(verbose: boolean) {
	return (cb: (err?: Error) => void) => {
		const args: string[] = ['-c', configPath]
		if (!verbose) {
			args.push('--quiet')
		}
		run({
			exec: 'build-storybook',
			args,
		})
			.then(filterShellCode)
			.then(...resolveGulpTask('rollup', cb))
	}
}
