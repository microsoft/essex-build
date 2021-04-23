/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { configureTasks } from './tasks'
import { BundleCommandOptions } from './types'
import { execGulpTask } from '@essex/build-utils'
import { success, fail } from '@essex/tasklogger'

export default function build(program: Command): void {
	program
		.command('bundle')
		.description('bundles a library package or website')
		.option('-v, --verbose', 'verbose output')		
		.option(
			'-wp, --webpack',
			'bundles webpack output using either the base config or webpack.config.js',
		)
		.option(
			'-rp, --rollup',
			'bundles rollup output using rollup.config.js. No default config.',
		)
		.option('-d, --docs', 'generates TypeDoc documentation')
		.option(
			'--env <env>',
			'build environment (used by babel and webpack)',
			'production',
		)
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'production',
		)
		.action((options: BundleCommandOptions) => {
			return Promise.resolve()
				.then(() => configureTasks(options))
				.then(build => execGulpTask(build))
				.then(() => success('bundle'))
				.catch(err => {
					console.log('error in bundle', err)
					process.exitCode = 1
					fail('bundle')
				})
		})
}
