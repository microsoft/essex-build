/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { clean as cleanTask } from '../steps/clean'

export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action(async (files: string[]) => {
			if (files.length === 0) {
				files = ['lib', 'dist']
			}

			await cleanTask(files)
		})
}
