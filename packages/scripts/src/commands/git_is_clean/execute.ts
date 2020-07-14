/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run, Job } from '@essex/shellrunner'

/**
 * Verifies that there are no active changes in the git index.
 */
export function execute(): Promise<number> {
	return Promise.resolve()
		.then(() => run(job))
		.then(({ code }) => code)
}

const job: Job = {
	exec: 'git',
	args: ['diff-index', '--quiet', 'HEAD'],
}
