/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, WatchCommandOptions } from './execute'

export default function watch(program: Command): void {
	program
		.command('watch')
		.description('sets up file watchers on TypeScript and Babel inputs')
		.option('-v, --verbose', 'verbose output')
		.option(
			'--env <env>',
			'build environment (used by babel and webpack)',
			'development',
		)
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'development',
		)
		.action(async (options: WatchCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
