/* eslint-disable @typescript-eslint/no-var-require */
import { join } from 'path'
import * as gulp from 'gulp'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { babelEsm, babelCjs } from '@essex/build-step-babel'
import { webpackBuild } from '@essex/build-step-webpack'
import { rollupBuild } from '@essex/build-step-rollup'
import { storybookBuild } from '@essex/build-step-storybook'
import { noopTask } from '@essex/build-utils-gulp'
import { BundleMode, BuildCommandOptions } from './types'
import { existsSync } from 'fs'

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
	mode = BundleMode.production,
}: BuildCommandOptions) {
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const generateDocs = docs ? generateTypedocs(verbose) : noopTask
	const buildStorybook = storybook ? storybookBuild(verbose) : noopTask
	const buildTypings = code ? emitTypings(tsConfigPath, verbose) : noopTask
	const compileTS = code ? compileTypescript(tsConfigPath, verbose) : noopTask
	const compileJS = code ? gulp.parallel(babelEsm(verbose, env), babelCjs(verbose, env)) : noopTask
	const bundleWebpack = webpack ? webpackBuild({ env, mode, verbose }) : noopTask
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
			gulp.parallel(
				bundleWebpack, 
				bundleRollup
			),
		),
	)
}
