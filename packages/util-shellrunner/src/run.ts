/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { parallel, single } from './strategies/index.js'
import type { Job, JobResult } from './types.js'

/**
 * Runs a series of jobs.
 * Each argument is run in sequence, if the argument is an array, that array is run in parallel.
 * @param runs The jobs to run
 */
export async function run(...jobs: Array<Job | Job[]>): Promise<JobResult> {
	const result = { code: 0, output: '', error: '' }
	for (const job of jobs) {
		const batchResult = await (Array.isArray(job)
			? parallel(...job)
			: single(job))
		result.code += batchResult.code
		result.output += batchResult.output
		result.error += batchResult.error

		if (result.code !== 0) {
			break
		}
	}
	return result
}
