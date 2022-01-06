/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run } from '@essex/shellrunner'
import { configureJob } from './configure'

export function lintStaged(): Promise<void> {
	const job = configureJob()
	return run(job).then(filterShellCode)
}

/**
 * A function to be used in .then() chains to convert non-zero exit codes
 * from shellrunner into job failures
 */
export function filterShellCode({ code }: { code: number }): void {
	if (code !== 0) {
		throw new Error('non-zero exit code')
	}
}
