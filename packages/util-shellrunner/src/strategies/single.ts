/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { printJob } from '../log'
import { Job, JobResult } from '../types'
import { execute } from './execute'

export async function single(job: Job): Promise<JobResult> {
	const { code } = await execute(job)
	printJob(job)
	return { code }
}
