/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { zip, ZipCommandOptions } from '@essex/build-step-zip'
import { fail, printPerf, success } from '@essex/tasklogger'
import { Command } from 'commander'

export default function zipCommand(program: Command): void {
	program
		.command('zip <destination> <sources...>')
		.option(
			'--baseDir <dir>>',
			'Specify input paths base directory (default=.)',
			process.cwd(),
		)
		.action(
			async (
				destination: string,
				sources: string[],
				{ baseDir }: ZipCommandOptions,
			) => {
				const code = await zip(destination, sources, { baseDir })
				if (code === 0) {
					success(`zip ${printPerf(0, performance.now())}`)
				} else {
					fail(`zip ${printPerf(0, performance.now())}`)
				}
				process.exit(code)
			},
		)
}
