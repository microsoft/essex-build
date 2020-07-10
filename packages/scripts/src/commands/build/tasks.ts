/* eslint-disable @typescript-eslint/no-var-require */
import { join } from 'path'
import * as gulp from 'gulp'
import * as debug from 'gulp-debug'
import * as babel from 'gulp-babel'
import * as ts from 'gulp-typescript'
import { noop } from '@essex/build-util-noop'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { BundleMode, BuildCommandOptions } from './types'

const cwd = process.cwd()
/* tsconfig.json _must_ exist */
const tsConfigJsonPath = join(cwd, 'tsconfig.json')
const packageJsonPath = join(cwd, 'package.json')
const packageJson = require(packageJsonPath)

export function configureTasks({
	verbose = false,
	env = 'development',
	docs = false,
	mode = BundleMode.production,
}: BuildCommandOptions) {
	const browserslist = getBrowsersList(env, packageJson.browserslist)
	const useBuiltIns = packageJson.useBuiltIns || false
	const corejs =
		packageJson.corejs || (useBuiltIns ? { version: 3 } : undefined)
	const babelEsmConfig = createBabelConfig(
		'esm',
		browserslist,
		useBuiltIns,
		corejs,
	)
	const babelCjsConfig = createBabelConfig(
		'cjs',
		browserslist,
		useBuiltIns,
		corejs,
	)

	function typedoc(cb: (err?: Error) => void) {
		if (docs) {
			generateTypedocs(verbose).then(
				() => cb(),
				(err: Error) => cb(err),
			)
		} else {
			cb()
		}
	}

	function compileTsc() {
		const tsProject = ts.createProject(tsConfigJsonPath)
		return gulp
			.src(['src/**/*.ts*', '!**/__tests__/**'])
			.pipe(tsProject())
			.pipe(verbose ? debug({ title: 'tsc' }) : noop())
			.pipe(gulp.dest('lib'))
	}

	function emitTypings() {
		const tsProject = ts.createProject(tsConfigJsonPath, {
			declaration: true,
			emitDeclarationOnly: true,
			stripInternal: true,
		})
		gulp
			.src(['src/**/*.ts*', '!**/__tests__/**'])
			.pipe(tsProject())
			.pipe(verbose ? debug({ title: 'typing' }) : noop())
			.pipe(gulp.dest('dist/typings'))
	}

	function babelEsm() {
		gulp
			.src(['lib/**/*.js'])
			.pipe(babel(babelEsmConfig))
			.pipe(verbose ? debug({ title: 'babel-esm' }) : noop())
			.pipe(gulp.dest('dist/esm'))
	}

	function babelCjs() {
		gulp
			.src(['lib/**/*.js'])
			.pipe(babel(babelCjsConfig))
			.pipe(verbose ? debug({ title: 'babel-esm' }) : noop())
			.pipe(gulp.dest('dist/cjs'))
	}

	const build = gulp.parallel(
		typedoc,
		gulp.series(
			gulp.parallel(compileTsc, emitTypings),
			gulp.parallel(babelEsm, babelCjs),
		),
	)
	return build
}

function getBrowsersList(
	env: string,
	setting: undefined | string[] | Record<string, string[]>,
): string[] {
	if (setting == null) {
		return ['> 0.25%, not dead']
	} else if (Array.isArray(setting)) {
		return setting
	} else {
		return setting[env]
	}
}

function createBabelConfig(
	modules: 'cjs' | 'esm',
	browsers: string[],
	useBuiltIns: boolean,
	corejs: undefined | { version: number },
): any {
	return {
		presets: [
			[
				require('@babel/preset-env'),
				{
					modules: modules === 'cjs' ? 'cjs' : false,
					targets: {
						browsers,
					},
					useBuiltIns,
					corejs,
				},
			],
		],
		plugins: [
			require('@babel/plugin-proposal-class-properties'),
			require('@babel/plugin-proposal-object-rest-spread'),
			require('@babel/plugin-proposal-optional-chaining'),
			require('@babel/plugin-proposal-nullish-coalescing-operator'),
		],
	} as any
}
