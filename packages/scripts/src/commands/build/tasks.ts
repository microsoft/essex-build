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
	env = 'production',
	docs = false,
	mode = BundleMode.production,
}: BuildCommandOptions) {
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	return gulp.parallel(
		docs ? generateTypedocs(verbose) : noopTask,
		storybook ? storybookBuild(verbose) : noopTask,
		emitTypings(tsConfigPath, verbose),
		gulp.series(
			compileTypescript(tsConfigPath, verbose),
			gulp.parallel(babelEsm(verbose, env), babelCjs(verbose, env)),
			gulp.parallel(webpackBuild({ env, mode, verbose }), rollupBuild),
		),
	)
}
