/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { docs as execDocs } from '@essex/build-step-docs'
import { prettyQuick } from '@essex/build-step-pretty-quick'
import * as gulp from 'gulp'
import { resolveGulpTask } from '../../utils'
import { LintCommandOptions } from './types'
import { subtaskSuccess, subtaskFail } from '../../utils/log'
import { join } from 'path'
import { existsSync } from 'fs'
const eslint = require('gulp-eslint')

const eslintDefault = join(__dirname, '../../config/.eslintrc-experiment')
const eslintOverride = join(process.cwd(), '.eslintrc')
const eslintConfig = existsSync(eslintOverride ? eslintOverride : eslintDefault)

export function configureTasks({
	fix = false,
	staged = false,
	docs = false,
	strict = false,
}: LintCommandOptions) {
	function checkCode() {
		gulp
			.src(['src/**/*', '*.js', '*.ts', '*.tsx'])
			.pipe(
				eslint({
					configFile: eslintConfig
				}),
			)
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.on('end', () => subtaskSuccess('eslint'))
			.on('error', () => subtaskFail('eslint'))
	}

	function checkFormatting(cb: (err?: Error) => void) {
		;(staged
			? prettyQuick({ staged: true })
			: prettyQuick({ check: !fix })
		).then(...resolveGulpTask('pretty-quick', cb))
	}

	function checkDocumentation(cb: (err?: Error) => void) {
		if (!docs) {
			return cb()
		} else {
			execDocs().then(...resolveGulpTask('docs', cb))
		}
	}

	const lint = gulp.parallel(checkCode, checkFormatting, checkDocumentation)
	return lint
}
