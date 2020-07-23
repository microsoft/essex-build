/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { gulpify } from '@essex/build-utils'
import { getJestConfiguration } from '@essex/jest-config'
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
		return runCLI(
			{
				...getJestConfiguration(),
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
		).then(({ results: { numFailedTestSuites, numFailedTests } }) => {
			if (numFailedTests > 0 || numFailedTestSuites > 0) {
				throw new Error(
					`${numFailedTests} failed tests; ${numFailedTestSuites} failed suites`,
				)
			}
		})
	} catch (err) {
		console.log('error running jest', err)
		return Promise.reject(err)
	}
}

export const jestGulp = gulpify('jest', jest)
