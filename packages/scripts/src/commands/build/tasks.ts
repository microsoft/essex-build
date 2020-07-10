/* eslint-disable @typescript-eslint/no-var-require */
import { join } from 'path'
import * as gulp from 'gulp'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { babelEsm, babelCjs } from '@essex/build-step-babel'
import { webpackBuild } from '@essex/build-step-webpack'
import { BundleMode, BuildCommandOptions } from './types'
import { existsSync } from 'fs'
import { run } from '@essex/shellrunner'
import { resolveGulpTask } from '../../utils'

const cwd = process.cwd()
/* tsconfig.json _must_ exist */
const tsConfigJsonPath = join(cwd, 'tsconfig.json')
const webpackConfigPath = join(cwd, 'webpack.config.js')
const rollupConfigPath = join(cwd, 'rollup.config.js')

export function configureTasks({
	verbose = false,
	env = 'production',
	docs = false,
	mode = BundleMode.production,
}: BuildCommandOptions) {
	function webpack(cb: (err?: Error) => void) {
		if (!existsSync(webpackConfigPath)) {
			return cb()
		} else {
			webpackBuild({ env, mode, verbose }).then(
				...resolveGulpTask('webpack', cb),
			)
		}
	}

	function rollup(cb: (err?: Error) => void) {
		if (!existsSync(rollupConfigPath)) {
			return cb()
		} else {
			run({
				exec: 'rollup',
				args: ['-c', rollupConfigPath],
			}).then(...resolveGulpTask('rollup', cb))
		}
	}

	const tsc = compileTypescript(tsConfigJsonPath, verbose)
	const tscDeclarations = emitTypings(tsConfigJsonPath, verbose)
	const typedoc = docs ? generateTypedocs(verbose) : (cb: Function) => cb()

	const build = gulp.parallel(
		typedoc,
		gulp.series(
			gulp.parallel(tsc, tscDeclarations),
			gulp.parallel(babelEsm(verbose), babelCjs(verbose)),
			gulp.parallel(webpack, rollup),
		),
	)
	return build
}
