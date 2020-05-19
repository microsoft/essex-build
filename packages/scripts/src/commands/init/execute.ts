/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initMonorepo } from './monorepo'
import { initLib } from './lib'

export interface InitCommandOptions {
	lib?: boolean
}

export function execute(config: InitCommandOptions): Promise<number> {
	if (config.lib) {
		return initLib()
	} else {
		return initMonorepo()
	}
}
