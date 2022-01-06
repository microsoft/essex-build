/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run } from '@essex/shellrunner'
import { configureJob } from './configure'

export async function lintStaged(): Promise<void> {
	const job = configureJob()
	const { code, error, output } = await run(job)
	if (code !== 0) {
		console.error(`error running task ${job.exec}`, error, output)
		throw new Error('non-zero exit code')
	}
}
