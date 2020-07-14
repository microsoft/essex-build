/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { filterShellCode, gulpify } from '@essex/build-utils'
import { run } from '@essex/shellrunner'
import { configureJob } from './configure'

export function lintStaged(): Promise<void> {
	const job = configureJob()
	return run(job).then(filterShellCode)
}

export const lintStagedGulp = gulpify('lint-staged', lintStaged)
