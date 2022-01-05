/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { zip, ZipCommandOptions } from '../../steps/zip'
import { fail, printPerf, success } from '../../util/tasklogger'

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
					success(`zip ${printPerf()}`)
				} else {
					fail(`zip ${printPerf()}`)
				}
				process.exit(code)
			},
		)
}
