/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { fail, printPerf, success } from '../../util/tasklogger'
import { Command } from 'commander'
import type { InitCommandOptions } from './execute'

export default function init(program: Command): void {
	program
		.command('init')
		.description('initializes essex-scripts configuration')
		.option('--lib', 'add typescript library configuration')
		.action((options: InitCommandOptions): Promise<any> => {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { execute } = require('./execute')
			return Promise.resolve()
				.then(() => execute(options))
				.then(() => success(`init ${printPerf(0, performance.now())}`))
				.catch(err => {
					console.log('error with init', err)
					fail(`init ${printPerf(0, performance.now())}`)
					process.exitCode = 1
				})
		})
}
