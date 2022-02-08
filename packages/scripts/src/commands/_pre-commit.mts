/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import { lintStaged } from '../steps/lint-staged/index.mjs'

export default function preCommit(program: Command): void {
	program
		.command('pre-commit')
		.description('execute pre-commit tasks (e.g. for husky hook)')
		.action(async () => {
			await lintStaged()
		})
}
