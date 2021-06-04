/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { execGulpTask } from '@essex/build-utils'
import { success, fail, printPerf } from '@essex/tasklogger'
import { Command } from 'commander'
import { configureTasks } from './tasks'
import { TestCommandOptions } from './types'

export default function unitTest(program: Command): void {
	program
		.command('test')
		.description('run unit tests')
		.option('-v, --verbose', 'verbose output')
		.option('--config-file <file>', 'configuration file to use')
		.option('--watch', 'set up tests in watch mode')
		.option('--coverage', 'apply test coverage')
		.option('--ci', 'use continuous integration mode')
		.option('--clear-cache', 'clear Jest internal cache')
		.option('-u,--update-snapshots', 'update test snapshots')
		.option(
			'--browser',
			'Respect the "browser" field in package.json when resolving modules. Some packages export different versions based on whether they are operating in node.js or a browser.',
		)
		.option(
			'--coverageThreshold',
			'a JSON string with which will be used to configure minimum threshold enforcement for coverage results',
		)
		.action((options: TestCommandOptions): Promise<any> => {
			return Promise.resolve(true)
				.then(() => configureTasks(options))
				.then(job => execGulpTask(job))
				.then(() => success(`test ${printPerf(0, performance.now())}`))
				.catch(err => {
					console.log('error in test', err)
					process.exitCode = 1
					fail(`test ${printPerf(0, performance.now())}`)
				})
		})
}
