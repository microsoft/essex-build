/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import gulp from 'gulp'
import { LintCommandOptions } from './types'
import { eslintGulp as eslint } from '@essex/build-step-eslint'
import { prettyQuickGulp as prettyQuick } from '@essex/build-step-pretty-quick'
import { gulpify, wrapPromiseTask } from '@essex/build-utils'

export function configureTasks(
	{ fix = false, staged = false, strict = false }: LintCommandOptions,
	files: string[] | undefined,
): gulp.TaskFunction {
	const checkCode = eslint(fix, strict, files || ['.'])

	const checkFormatting = staged
		? prettyQuick({ staged: true })
		: prettyQuick({ check: !fix })

	return gulp.parallel(checkCode, checkFormatting)
}
