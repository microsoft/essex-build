/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { gulpify } from '@essex/build-utils'
import config from '@essex/jest-config'
import { runCLI } from '@jest/core'

export interface TestCommandOptions {
	verbose?: boolean
	coverage?: boolean
	watch?: boolean
	ci?: boolean
	clearCache?: boolean
	updateSnapshots?: boolean
	coverageThreshold?: string
	browser?: boolean
}

export function jest({
	verbose,
	coverage,
	watch,
	ci,
	clearCache,
	updateSnapshots,
	coverageThreshold,
	browser,
}: TestCommandOptions): Promise<void> {
	try {
		const jestConfig: any = {
			...config,
		}
		return runCLI(
			{
				...jestConfig,
				verbose,
				coverage,
				watch,
				ci,
				clearCache,
				updateSnapshots,
				coverageThreshold,
				browser,
			},
			[process.cwd()],
		).then(({ results }) => {
			if (results.numFailedTests || results.numFailedTestSuites) {
				return Promise.reject()
			} else {
				return Promise.resolve()
			}
		})
	} catch (err) {
		console.error('error running jest', err)
		return Promise.reject(err)
	}
}

export const jestGulp = gulpify('jest', jest)
