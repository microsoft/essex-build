/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { clean as cleanTask } from '@essex/build-step-clean'
import { resolveShellCode } from '@essex/build-utils'
import { Command } from 'commander'

export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action((files: string[]) => {
			if (files.length === 0) {
				files = ['lib', 'dist']
			}
			Promise.resolve()
				.then(() => cleanTask(files))
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
