/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { Command } from 'commander'
import { lintStaged } from '../../steps/lint-staged'
import { success, fail, printPerf } from '../../util/tasklogger'

export default function preCommit(program: Command): void {
	program
		.command('pre-commit')
		.description('execute pre-commit tasks (e.g. for husky hook)')
		.action(() => {
			Promise.resolve()
				.then(() => lintStaged())
				.then(() => success(`pre-commit ${printPerf(0, performance.now())}`))
				.catch(err => {
					console.log('error in precommit', err)
					process.exitCode = 1
					fail(`pre-commit ${printPerf(0, performance.now())}`)
				})
		})
}
