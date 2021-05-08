/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import type { BuildCommandOptions } from './types'
import { execGulpTask } from '@essex/build-utils'
import { success, fail, printPerf } from '@essex/tasklogger'
import { performance } from 'perf_hooks'
import { processStart } from '../../timers'
import { configureTasks } from './tasks'

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
		.action(
			(options: BuildCommandOptions): Promise<any> => {
				return Promise.resolve()
					.then(() => configureTasks(options))
					.then(build => execGulpTask(build))
					.then(() => {
						const end = performance.now()
						success(`build ${printPerf(processStart(), end)}`)
					})
					.catch(err => {
						console.log('error in build', err)
						process.exitCode = 1
						fail('build')
					})
			},
		)
}
