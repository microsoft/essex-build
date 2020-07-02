/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { getConfigPath } from '../../utils'
import { run } from '@essex/shellrunner'

export default function preCommit(program: Command): void {
	program
		.command('pre-commit')
		.description('execute pre-commit tasks (for husky hook)')
		.action(async () => {
			const configPath = await getConfigPath('.lintstagedrc')
			const { code } = await run({
				exec: 'lint-staged',
				args: ['-c', configPath],
			})
			process.exit(code)
		})
}
