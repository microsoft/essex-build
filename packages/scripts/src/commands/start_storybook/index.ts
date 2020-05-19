/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, StartStorybookCommandOptions } from './execute'

export default function start(program: Command): void {
	program
		.command('start-storybook')
		.description('starts the storybook server on the current package')
		.option('-v, --verbose', 'verbose output')
		.action(async (options: StartStorybookCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
