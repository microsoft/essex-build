/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import gulp from 'gulp'
import { LintCommandOptions } from './types'
import { eslint } from '@essex/build-step-eslint'
import { prettyQuick } from '@essex/build-step-pretty-quick'
import { resolveGulpTask } from '@essex/build-utils'
import { performance } from 'perf_hooks'

export function configureTasks(
	{
		fix = false,
		staged = false,
		docs = false,
		strict = false,
		docsOnly = false,
	}: LintCommandOptions,
	files: string[] | undefined,
): gulp.TaskFunction {
	function checkCode(cb: (err?: Error) => void) {
		const start = performance.now()
		eslint(fix, strict, files || ['.']).then(
			...resolveGulpTask('eslint', start, cb),
		)
	}

	function checkFormatting(cb: (err?: Error) => void) {
		const start = performance.now()
		const task = staged
			? prettyQuick({ staged: true })
			: prettyQuick({ check: !fix })
		task.then(...resolveGulpTask('pretty-quick', start, cb))
	}

	return gulp.parallel(checkCode, checkFormatting)
}
