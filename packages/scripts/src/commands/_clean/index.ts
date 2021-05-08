/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { now, processStart } from '../../timers'
import { clean as cleanTask } from '@essex/build-step-clean'
import { success, fail, printPerf } from '@essex/tasklogger'

export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action((files: string[]) => {
			if (files.length === 0) {
				files = ['lib', 'dist']
			}
			return Promise.resolve()
				.then(() => cleanTask(files))
				.then(() => success(`clean ${printPerf(processStart(), now())}`))
				.catch(err => {
					console.log('error in clean', err)
					fail(`clean ${printPerf(processStart(), now())}`)
					process.exitCode = 1
				})
		})
}
