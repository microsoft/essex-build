/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import { buildBabel } from '@essex/build-step-babel'
import { rollupBuild } from '@essex/build-step-rollup'
import { storybookBuildGulp } from '@essex/build-step-storybook'
import { generateTypedocsGulp } from '@essex/build-step-typedoc'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { webpackBuildGulp } from '@essex/build-step-webpack'
import { noopTask } from '@essex/build-utils'
import * as gulp from 'gulp'
import { BuildCommandOptions } from './types'

const cwd = process.cwd()
const tsConfigPath = join(cwd, 'tsconfig.json')

export function configureTasks({
	verbose = false,
	storybook = false,
	webpack = false,
	rollup = false,
	docs = false,
	code = !webpack && !rollup,
	env = 'production',
	mode = 'production',
}: BuildCommandOptions): gulp.TaskFunction {
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const generateDocs = docs ? generateTypedocsGulp(verbose) : noopTask
	const buildStorybook = storybook ? storybookBuildGulp(verbose) : noopTask
	const buildTypings = code ? emitTypings() : noopTask
	const compileTS = code ? compileTypescript() : noopTask
	const compileJS = code ? buildBabel(env) : noopTask
	const bundleWebpack = webpack
		? webpackBuildGulp({ env, mode, verbose })
		: noopTask
	const bundleRollup = rollup ? rollupBuild : noopTask

	return gulp.parallel(
		generateDocs,
		buildStorybook,
		buildTypings,
		//
		// The primary transpilation pipeline
		//  tsc -> babel -> bundlers
		//
		gulp.series(
			compileTS,
			compileJS,
			gulp.parallel(bundleWebpack, bundleRollup),
		),
	)
}
