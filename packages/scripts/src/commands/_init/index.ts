/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fail, printPerf, success } from '@essex/tasklogger'
import { Command } from 'commander'
import { now, processStart } from '../../timers'
import type { InitCommandOptions } from './execute'

export default function init(program: Command): void {
	program
		.command('init')
		.description('initializes essex-scripts configuration')
		.option('--lib', 'add typescript library configuration')
		.action(
			(options: InitCommandOptions): Promise<any> => {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const { execute } = require('./execute')
				return Promise.resolve()
					.then(() => execute(options))
					.then(() => success(`init ${printPerf(processStart(), now())}`))
					.catch(err => {
						console.log('error with init', err)
						fail(`init ${printPerf(processStart(), now())}`)
						process.exitCode = 1
					})
			},
		)
}
