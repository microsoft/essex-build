/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { success, fail, printPerf } from '@essex/tasklogger'
import { now, processStart } from '../../timers'
import { lintStaged } from '@essex/build-step-lint-staged'

export default function preCommit(program: Command): void {
	program
		.command('pre-commit')
		.description('execute pre-commit tasks (e.g. for husky hook)')
		.action(() => {
			Promise.resolve()
				.then(() => lintStaged())
				.then(() => success(`pre-commit ${printPerf(processStart(), now())}`))
				.catch(err => {
					console.log('error in precommit', err)
					process.exitCode = 1
					fail(`pre-commit ${printPerf(processStart(), now())}`)
				})
		})
}
