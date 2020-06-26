/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Job, JobResult } from '../types'
import { execute } from './execute'
import * as log from '../log'

export async function single(job: Job): Promise<JobResult> {
	const { exec, id } = job
	let code = 0
	const result = await execute(job)
	const subCode = result.code
	log.printJob(job)
	if (subCode > 0) {
		code = subCode
		log.subtaskFail(`${exec}${id ? `[${id}]` : ''} failed`)
	} else {
		log.subtaskSuccess(`${exec}${id ? `[${id}]` : ''} passed`)
	}
	return { code }
}
