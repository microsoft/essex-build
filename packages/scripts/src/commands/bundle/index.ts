/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, BundleCommandOptions } from './execute'

export default function build(program: Command): void {
	program
		.command('bundle')
		.description('bundles a webpack application')
		.option('-v, --verbose', 'verbose output')
		.option('--env <env>', 'build environment', 'development')
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'development',
		)
		.action(async (options: BundleCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
