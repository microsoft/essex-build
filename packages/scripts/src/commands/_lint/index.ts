/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { LintCommandOptions } from './types'
import { execGulpTask } from '@essex/build-utils'
import { success, fail, printPerf } from '@essex/tasklogger'
import { now, processStart } from '../../timers'
import { configureTasks } from './tasks'

export default function lint(program: Command): void {
	program
		.command('lint [...files]')
		.description('performs static analysis checks')
		.option('-f, --fix', 'correct fixable problems')
		.option('--staged', 'only do git-stage verifications')
		.option('--strict', 'strict linting, warnings will cause failure')
		.action((files: string[], options: LintCommandOptions = {}) => {
			return Promise.resolve()
				.then(() => configureTasks(options, files))
				.then(lint => execGulpTask(lint))
				.then(() => success(`lint ${printPerf(processStart(), now())}`))
				.catch(err => {
					console.log('error in lint', err)
					process.exitCode = 1
					fail(`lint ${printPerf(processStart(), now())}`)
				})
		})
}
