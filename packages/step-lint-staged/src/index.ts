/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configureJob } from './configure'
import { filterShellCode, gulpify, wrapPromiseTask } from '@essex/build-utils'
import { run } from '@essex/shellrunner'

export function lintStaged(): Promise<void> {
	const job = configureJob()
	return run(job).then(filterShellCode)
}

export const lintStagedGulp = gulpify(
	wrapPromiseTask('lint-staged', false, lintStaged),
)
