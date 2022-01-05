/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { success, fail, printPerf } from '@essex/tasklogger'
import type { Command } from 'commander'
import { executeBuild } from './tasks'
import type { BuildCommandOptions } from './types'

export default function build(program: Command): void {
	program
		.command('build')
		.description('builds a library package')
		.option('-v, --verbose', 'verbose output')
		.option('-d, --docs', 'generates TypeDoc documentation')
		.option(
			'--env <env>',
			'build environment (used by babel and webpack)',
			'production',
		)
		.option(
			'--stripInternalTypes',
			'strip out internal types from typings declarations',
		)
		.action((options: BuildCommandOptions): Promise<any> => {
			return Promise.resolve()
				.then(() => executeBuild(options))
				.then(() => {
					const end = performance.now()
					success(`build ${printPerf(0, end)}`)
				})
				.catch(err => {
					console.log('error in build', err)
					process.exitCode = 1
					fail('build')
				})
		})
}
;