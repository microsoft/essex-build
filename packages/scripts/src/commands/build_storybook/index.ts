/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, BuildStorybookCommandOptions } from './execute'

export default function build(program: Command): void {
	program
		.command('build-storybook')
		.description('builds the current package as a storybook')
		.option('-v, --verbose', 'verbose output')
		.action(async (options: BuildStorybookCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
