/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { execGulpTask } from '@essex/build-utils'
import { success, fail } from '@essex/tasklogger'
import { configureTasks } from './tasks'

export interface AuditCommandOptions {
	verbose: boolean
}

export function execute(options: AuditCommandOptions): Promise<number> {
	return Promise.resolve()
		.then(() => configureTasks())
		.then(build => execGulpTask(build))
		.then(
			() => 0,
			() => 1,
		)
}
