/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { noopStep } from '@essex/build-utils'
import config from '@essex/jest-config'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as gulp from 'gulp'
import * as debug from 'gulp-debug'
const jestExec = require('gulp-jest').default

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
}: TestCommandOptions) {
	return () =>
		gulp
			.src([
				'**/__tests__/**/*.spec.ts',
				'**/__tests__/**/*.spec.tsx',
				'**/__tests__/**/*.spec.js',
				'**/__tests__/**/*.spec.jsx',
				'!**/node_modules/**',
				'!**/lib/**',
				'!**/dist/**',
				'!**/build/**',
			])
			.pipe(verbose ? debug({ title: 'jest' }) : noopStep())
			.pipe(
				jestExec({
					...config,
					verbose,
					coverage,
					watch,
					ci,
					clearCache,
					updateSnapshots,
					coverageThreshold,
					browser,
				}),
			)
			.on('end', () => subtaskSuccess('jest'))
			.on('error', () => subtaskFail('jest'))
}
