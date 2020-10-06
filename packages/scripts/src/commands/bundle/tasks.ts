/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import { rollupBuild } from '@essex/build-step-rollup'
import { storybookBuildGulp } from '@essex/build-step-storybook'
import { webpackBuildGulp } from '@essex/build-step-webpack'
import { noopTask } from '@essex/build-utils'
import { TaskFunction, parallel } from 'gulp'
import { BundleCommandOptions } from './types'

const wpConfigExists = existsSync(join(process.cwd(), 'webpack.config.js'))
const rollupConfigExists = existsSync(join(process.cwd(), 'rollup.config.js'))
const storybookConfigExists = existsSync(join(process.cwd(), '.storybook'))

export function configureTasks({
	verbose = false,
	storybook = storybookConfigExists,
	webpack = wpConfigExists,
	rollup = rollupConfigExists,
	env = 'production',
	mode = 'production',
}: BundleCommandOptions): TaskFunction {
	if (!webpack && !rollup && !storybook) {
		throw new Error(
			'--webpack, --rollup, or --storybook flags must be passed to bundle command',
		)
	}
	const buildStorybook = storybook ? storybookBuildGulp(verbose) : noopTask
	const bundleWebpack = webpack
		? webpackBuildGulp({ env, mode, verbose })
		: noopTask
	const bundleRollup = rollup ? rollupBuild : noopTask

	return parallel(buildStorybook, bundleWebpack, bundleRollup)
}
