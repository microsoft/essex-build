/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getConfigPath, run } from '../../utils'
import { Command } from 'commander'

export default function preCommit(program: Command): void {
	program
		.command('pre-commit')
		.description('execute pre-commit tasks (for husky hook)')
		.action(async () => {
			const configPath = await getConfigPath('.lintstagedrc')
			const { code } = await run('lint-staged', ['-c', configPath])
			process.exit(code)
		})
}
