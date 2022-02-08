/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import { initLib, initMonorepo } from '../steps/init/index.mjs'

export default function init(program: Command): void {
	program
		.command('init')
		.description('initializes essex-scripts configuration')
		.option('--lib', 'add typescript library configuration')
		.action(async (options: InitCommandOptions): Promise<any> => {
			await execute(options)
		})
}

interface InitCommandOptions {
	lib?: boolean
}

function execute(config: InitCommandOptions): Promise<number> {
	if (config.lib) {
		return initLib()
	} else {
		return initMonorepo()
	}
}
