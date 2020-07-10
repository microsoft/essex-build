/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fail, success } from '@essex/tasklogger'
import { configureTasks } from './tasks'
import { BuildCommandOptions } from './types'
import { execGulpTask } from '@essex/build-utils-gulp'

export async function execute(options: BuildCommandOptions): Promise<number> {
	try {
		const build = configureTasks(options)
		await execGulpTask(build)
		success('build succeeded')
		return 0
	} catch (err) {
		fail('build failed', err)
		return 1
	}
}