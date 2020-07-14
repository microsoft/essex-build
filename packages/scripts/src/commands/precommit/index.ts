/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { lintStaged } from '@essex/build-step-lint-staged'
import { Command } from 'commander'

export default function preCommit(program: Command): void {
	program
		.command('pre-commit')
		.description('execute pre-commit tasks (for husky hook)')
		.action(() => {
			Promise.resolve()
				.then(() => lintStaged())
				.then(
					() => 0,
					() => 1,
				)
				.then(code => process.exit(code))
		})
}
