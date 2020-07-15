/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { execGulpTask, resolveShellCode } from '@essex/build-utils'
import { Command } from 'commander'
import { configureTasks } from './tasks'
import { WatchCommandOptions } from './types'

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
			Promise.resolve()
				.then(() => configureTasks(options))
				.then(build => execGulpTask(build))
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
