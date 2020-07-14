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

export async function execute(options: AuditCommandOptions): Promise<number> {
	try {
		const build = configureTasks()
		await execGulpTask(build)
		success('audit succeeded')
		return 0
	} catch (err) {
		fail('audit failed')
		return 1
	}
}
