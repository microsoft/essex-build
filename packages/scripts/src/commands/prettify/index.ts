/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, PrettierCommandOptions } from './execute'

/**
 * Runs the prettier tool to format client source code
 * @param program The CLI program
 */
export default function prettify(program: Command): void {
	program
		.command('prettify')
		.option('-v, --verbose', 'verbose output')
		.action(async (options: PrettierCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
