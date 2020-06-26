/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as log from '../log'
import { Job, JobResult } from '../types'
import { single } from './single'

/**
 * Run a series of jobs in parallel
 * @param jobs the jobs to run
 */
export async function parallel(...jobs: Job[]): Promise<JobResult> {
	log.debug('--running parallel jobs--')
	for (const job of jobs) {
		log.printJob(job)
	}
	log.debug('-------------------------')
	const results = await Promise.all(jobs.map(job => single(job)))
	const code = Math.max(...results.map(r => r.code))
	return { code }
}
