/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute } from './execute'

export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action(async (files: string[]) => {
			if (files.length === 0) {
				files = ['lib', 'dist']
			}
			const code = await execute(files)
			process.exit(code)
		})
}
