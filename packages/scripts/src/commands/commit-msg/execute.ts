/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { execGulpTask } from '@essex/build-utils'
import { success, fail } from '@essex/tasklogger'
import { configureTasks } from './tasks'

export async function execute(): Promise<number> {
	try {
		const task = configureTasks()
		await execGulpTask(task)
		success('commit-msg succeeded')
		return 0
	} catch (err) {
		fail('commit-msg failed', err)
		return 1
	}
}
