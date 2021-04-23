/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import gulp from 'gulp'
import { BundleCommandOptions } from './types'
import { rollupBuild } from '@essex/build-step-rollup'
import { webpackBuildGulp } from '@essex/build-step-webpack'
import { noopTask } from '@essex/build-utils'

const wpConfigExists = existsSync(join(process.cwd(), 'webpack.config.js'))
const rollupConfigExists = existsSync(join(process.cwd(), 'rollup.config.js'))

export function configureTasks({
	verbose = false,
	webpack = wpConfigExists,
	rollup = rollupConfigExists,
	env = 'production',
	mode = 'production',
}: BundleCommandOptions): gulp.TaskFunction {
	if (!webpack && !rollup) {
		throw new Error(
			'--webpack or --rollup flag must be passed to bundle command',
		)
	}
	const bundleWebpack = webpack
		? webpackBuildGulp({ env, mode, verbose })
		: noopTask
	const bundleRollup = rollup ? rollupBuild : noopTask

	return gulp.parallel(bundleWebpack, bundleRollup)
}
