/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { runSequential, RunArg } from '@essex/shellrunner'

export interface PrettierCommandOptions {
	verbose: boolean
}

export async function execute({
	verbose,
}: PrettierCommandOptions): Promise<number> {
	const run: RunArg = {
		exec: 'pretty-quick',
		args: [],
	}

	if (verbose) {
		run.args.push('--verbose')
	}

	return await runSequential(run)
}
