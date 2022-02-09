/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run, Job } from '@essex/shellrunner'
import type { Command } from 'commander'

export default function start(program: Command): void {
	program
		.command('git-is-clean')
		.description('verifies that there are no active git changes')
		.action(async () => {
			const { code } = await run(isCleanJob)
			if (code !== 0) {
				await run(statusJob, diffJob)
			}
			process.exitCode = code
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
