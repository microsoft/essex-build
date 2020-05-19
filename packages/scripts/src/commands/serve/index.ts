/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, ServeCommandOptions } from './execute'

export default function build(program: Command): void {
	program
		.command('serve')
		.description('serves a Webpack App using webpack-dev-server')
		.option('--env <env>', 'build environment', 'development')
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'development',
		)
		.option('-v, --verbose', 'verbose output')
		.action(async (options: ServeCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
