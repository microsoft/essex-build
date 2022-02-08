/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as log from '../log.js'
import type { Job, JobResult } from '../types.js'
import { execute } from './execute.js'

export async function single(job: Job): Promise<JobResult> {
	const { code } = await execute(job)
	log.printJob(job)
	return { code }
}
