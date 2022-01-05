/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { Command } from 'commander'
import { prettyQuick } from '../../steps/pretty-quick'
import { success, fail, printPerf } from '../../util/tasklogger'

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

			return prettyQuick({
				staged,
				verbose,
			})
				.then(() => success(`prettify ${printPerf(0, performance.now())}`))
				.catch((err: Error) => {
					console.log('error in prettify', err)
					process.exitCode = 1
					fail(`prettify ${printPerf(0, performance.now())}`)
				})
		})
}
