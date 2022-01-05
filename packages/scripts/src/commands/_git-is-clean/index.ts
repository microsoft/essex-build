/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run, Job } from '@essex/shellrunner'
import { Command } from 'commander'
import * as logger from '../../util/tasklogger'

export default function start(program: Command): void {
	program
		.command('git-is-clean')
		.description('verifies that there are no active git changes')
		.action(() => {
			return Promise.resolve()
				.then(() => run(isCleanJob))
				.then(({ code }) =>
					code !== 0 ? run(statusJob, diffJob).then(() => code) : code,
				)
				.then(code => {
					process.exitCode = code
					if (code === 0) {
						logger.success(`git is clean ${logger.printPerf()}`)
					} else {
						logger.fail(`git is clean ${logger.printPerf()}`)
					}
				})
				.catch(err => {
					console.log('error in git-is-clean', err)
					logger.fail('git is clean')
					process.exitCode = 1
				})
		})
}

const isCleanJob: Job = {
	exec: 'git',
	args: ['diff-index', '--quiet', 'HEAD'],
}
const statusJob: Job = {
	exec: 'git',
	args: ['status'],
}
const diffJob: Job = {
	exec: 'git',
	args: ['diff', '--exit-code'],
}
