/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as log from '../log'
import { Job, JobResult } from '../types'
import { execute } from './execute'

export async function single(job: Job): Promise<JobResult> {
	const { code } = await execute(job)
	log.printJob(job)
	return { code }
}
