/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { zip, ZipCommandOptions } from '@essex/build-step-zip'
import { fail, printPerf, success } from '@essex/tasklogger'
import { now, processStart } from '../../timers'

export default function zipCommand(program: Command): void {
	program
		.command('zip <destination> <sources...>')
		.option(
			'--cwd <cwd>',
			'Specify working directory (default=.)',
			process.cwd(),
		)
		.action(
			async (
				destination: string,
				sources: string[],
				{ cwd }: ZipCommandOptions,
			) => {
				const code = await zip(destination, sources, { cwd })
				if (code === 0) {
					success(`zip ${printPerf(processStart(), now())}`)
				} else {
					fail(`zip ${printPerf(processStart(), now())}`)
				}
				process.exit(code)
			},
		)
}
