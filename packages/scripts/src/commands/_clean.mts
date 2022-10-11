/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { rm } from '../steps/rm.js'

export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action(async (files: string[]) => {
			if (files.length === 0) {
				files = ['lib', 'dist']
			}

			await Promise.all(files.filter(f => !!f).map(f => rm(f)))
		})
}
