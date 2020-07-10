/* eslint-disable @typescript-eslint/no-var-require */
import { join } from 'path'
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import * as ts from 'gulp-typescript'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { webpackBuild } from '@essex/build-step-webpack'
import { BundleMode, BuildCommandOptions } from './types'
import { subtaskSuccess, subtaskFail } from '../../utils/log'
import { getBabelConfigs } from '../../config'
import { existsSync } from 'fs'
import { run } from '@essex/shellrunner'
import { resolveGulpTask } from '../../utils'

const cwd = process.cwd()
/* tsconfig.json _must_ exist */
const tsConfigJsonPath = join(cwd, 'tsconfig.json')
const webpackConfigPath = join(cwd, 'webpack.config.js')
const rollupConfigPath = join(cwd, 'rollup.config.js')

export function configureTasks({
	verbose = true,
	env = 'production',
	docs = false,
	mode = BundleMode.production,
}: BuildCommandOptions) {
	const [babelEsmConfig, babelCjsConfig] = getBabelConfigs(env)

	function typedoc(cb: (err?: Error) => void) {
		if (docs) {
			generateTypedocs(verbose).then(...resolveGulpTask('typedoc', cb))
		} else {
			cb()
		}
	}

	function compileTsc() {
		const tsProject = ts.createProject(tsConfigJsonPath)
		return gulp
			.src(['src/**/*.ts*', '!**/__tests__/**'])
			.pipe(tsProject())
			.pipe(gulp.dest('lib'))
			.on('end', () => subtaskSuccess('tsc'))
			.on('error', () => subtaskFail('tsc'))
	}

	function emitTypings() {
		const tsProject = ts.createProject(tsConfigJsonPath, {
			declaration: true,
			emitDeclarationOnly: true,
			stripInternal: true,
		})
		return gulp
			.src(['src/**/*.ts*', '!**/__tests__/**'])
			.pipe(tsProject())
			.pipe(gulp.dest('dist/typings'))
			.on('end', () => subtaskSuccess('typings'))
			.on('error', () => subtaskFail('typings'))
	}

	function babelEsm() {
		return gulp
			.src(['lib/**/*.js'])
			.pipe(babel(babelEsmConfig))
			.pipe(gulp.dest('dist/esm'))
			.on('end', () => subtaskSuccess('babel-esm'))
			.on('error', () => subtaskFail('babel-esm'))
	}

	function babelCjs() {
		return gulp
			.src(['lib/**/*.js'])
			.pipe(babel(babelCjsConfig))
			.pipe(gulp.dest('dist/cjs'))
			.on('end', () => subtaskSuccess('babel-cjs'))
			.on('error', () => subtaskFail('babel-cjs'))
	}

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

	const build = gulp.parallel(
		typedoc,
		gulp.series(
			gulp.parallel(compileTsc, emitTypings),
			gulp.parallel(babelEsm, babelCjs),
			gulp.parallel(webpack, rollup),
		),
	)
	return build
}
