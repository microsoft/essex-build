/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { clean as cleanTask } from '@essex/build-step-clean'
import { Command } from 'commander'

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
				.catch(err => {
					console.error('error in clean', err)
					process.exitCode = 1
				})
		})
}
