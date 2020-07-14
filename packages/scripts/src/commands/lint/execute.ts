/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { execGulpTask } from '@essex/build-utils'
import { configureTasks } from './tasks'
import { LintCommandOptions } from './types'

export function execute(options: LintCommandOptions): Promise<number> {
	return Promise.resolve(true)
		.then(() => configureTasks(options))
		.then(lint => execGulpTask(lint))
		.then(
			() => 0,
			() => 1,
		)
}
