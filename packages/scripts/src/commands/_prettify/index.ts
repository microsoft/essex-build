/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { now, processStart } from '../../timers'
import { success, fail, printPerf } from '@essex/tasklogger'

interface PrettifyCommandOptions {
	verbose?: boolean
	staged?: boolean
}

/**
 * Runs the prettier tool to format client source code
 * @param program The CLI program
 */
export default function prettify(program: Command): void {
	program
		.command('prettify')
		.option('-v, --verbose', 'verbose output')
		.option('--staged', 'run on staged files')
		.action(({ staged, verbose }: PrettifyCommandOptions) => {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { prettyQuick } = require('@essex/build-step-pretty-quick')
			return prettyQuick({
				staged,
				verbose,
			})
				.then(() => success(`prettify ${printPerf(processStart(), now())}`))
				.catch((err: Error) => {
					console.log('error in prettify', err)
					process.exitCode = 1
					fail(`prettify ${printPerf(processStart(), now())}`)
				})
		})
}
