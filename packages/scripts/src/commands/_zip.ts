/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import { zip, ZipCommandOptions } from '../steps/zip'

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
				await zip(destination, sources, { baseDir })
			},
		)
}
