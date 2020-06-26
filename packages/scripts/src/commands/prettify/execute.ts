/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run, Job } from '@essex/shellrunner'

export interface PrettierCommandOptions {
	verbose: boolean
}

export async function execute({
	verbose,
}: PrettierCommandOptions): Promise<number> {
	const job: Job = {
		exec: 'pretty-quick',
		args: [],
	}

	if (verbose) {
		job.args.push('--verbose')
	}

	const result = await run(job)
	return result.code
}
