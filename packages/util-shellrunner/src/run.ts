/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { parallel, single } from './strategies'
import type { Job, JobResult } from './types'

/**
 * Runs a series of jobs.
 * Each argument is run in sequence, if the argument is an array, that array is run in parallel.
 * @param runs The jobs to run
 */
export async function run(...jobs: Array<Job | Job[]>): Promise<JobResult> {
	let code = 0
	for (const job of jobs) {
		const result = await (Array.isArray(job) ? parallel(...job) : single(job))
		code = result.code
		if (code !== 0) {
			break
		}
	}
	return { code }
}
