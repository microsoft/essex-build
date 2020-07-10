/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { Job, run } from '@essex/shellrunner'
import { gulpExec } from '../../utils'
import { success, fail } from '../../utils/log'
import { configureTasks } from './tasks'
import { LintCommandOptions } from './types'

export async function execute(options: LintCommandOptions): Promise<number> {
	try {
		const lint = configureTasks(options)
		await gulpExec(lint)
		success('lint succeeded')
		return 0
	} catch (err) {
		fail('lint failed', err)
		return 1
	}
}
