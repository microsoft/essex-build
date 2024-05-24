/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { rm } from '../steps/rm.js'

// biome-ignore lint/style/noDefaultExport: this is a CLI command
export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action(async (files: string[]) => {
			let target = files
			if (files.length === 0) {
				target = ['lib', 'dist']
			}

			await Promise.all(target.filter((f) => !!f).map((f) => rm(f)))
		})
}
