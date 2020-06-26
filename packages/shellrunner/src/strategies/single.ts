/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Job, JobResult } from '../types'
import { execute } from './execute'
import * as log from '../log'

export async function single(job: Job): Promise<JobResult> {
	const { exec, id } = job
	const { code } = await execute(job)
	log.printJob(job)
	if (code > 0) {
		log.subtaskFail(`${exec}${id ? `[${id}]` : ''} failed`)
	} else {
		log.subtaskSuccess(`${exec}${id ? `[${id}]` : ''} passed`)
	}
	return { code }
}
