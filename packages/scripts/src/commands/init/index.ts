/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, InitCommandOptions } from './execute'

export default function init(program: Command): void {
	program
		.command('init')
		.description('initializes essex-scripts configuration')
		.option('--lib', 'add typescript library configuration')
		.action(async (options: InitCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
