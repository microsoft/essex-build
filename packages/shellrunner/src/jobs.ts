/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as log from './log'
import * as debug from 'debug'
import { RunArg } from './types'
import { run } from './run'

const debugLog = debug('essex::jobs')

/**
 * Run a series of jobs in parallel
 * @param jobs the jobs to run
 */
export async function runParallel(...jobs: RunArg[]): Promise<number> {
	debugLog('--running parallel jobs--')
	for (const job of jobs) {
		printJob(job)
	}
	debugLog('-------------------------')
	const results = await Promise.all(jobs.map(job => executeJob(job)))
	return Math.max(...results)
}

/**
 * Runs a series of jobs in sequence
 * @param runs The jobs to run
 */
export async function runSequential(
	...jobs: Array<RunArg | RunArg[]>
): Promise<number> {
	let code = 0
	for (const job of jobs) {
		code = await (Array.isArray(job) ? runParallel(...job) : executeJob(job))
		if (code !== 0) {
			break
		}
	}
	return code
}

async function executeJob(job: RunArg): Promise<number> {
	const { exec, id, args } = job
	let code = 0
	const result = await run({ exec, args })
	const subCode = result.code
	printJob(job)
	if (subCode > 0) {
		code = 1
		log.subtaskFail(`${exec}${id ? `[${id}]` : ''} failed`)
	} else {
		log.subtaskSuccess(`${exec}${id ? `[${id}]` : ''} passed`)
	}
	return code
}

function printJob(job: RunArg): void {
	const message = `executing: [${job.exec} ${job.args.join(' ')}]`
	debugLog(message)
}
