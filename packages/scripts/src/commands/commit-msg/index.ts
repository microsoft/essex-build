/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute } from './execute'

export default function commitMsg(program: Command): void {
	program
		.command('commit-msg')
		.description('commit message verification (for husky hook)')
		.action(async () => {
			const code = await execute()
			process.exit(code)
		})
}
