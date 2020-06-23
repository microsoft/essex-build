/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute } from './execute'

export default function start(program: Command): void {
	program
		.command('git-is-clean')
		.description('verifies that there are no active git changes')
		.action(async () => {
			const code = await execute()
			process.exit(code)
		})
}
