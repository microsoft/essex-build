/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configureTasks } from './tasks'
import { BuildCommandOptions } from './types'
import { execGulpTask } from '@essex/build-utils'

export function execute(options: BuildCommandOptions): Promise<number> {
	return Promise.resolve()
		.then(() => configureTasks(options))
		.then(build => execGulpTask(build))
		.then(
			() => 0,
			() => 1,
		)
}
