/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import { noopStep } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import * as debug from 'gulp-debug'

const BABEL_GLOBS = ['lib/**/*.js']

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
function babelCjs(verbose: boolean, env: string): () => NodeJS.ReadWriteStream {
	const cjsConfig = getCjsConfiguration(env)
	const title = 'babel-cjs'
	return function execute() {
		return gulp
			.src(BABEL_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(babel(cjsConfig))
			.pipe(verbose ? debug({ title }) : noopStep())
			.pipe(gulp.dest('dist/cjs'))
			.on('end', () => subtaskSuccess(title))
			.on('error', () => subtaskFail(title))
	}
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
function babelEsm(verbose: boolean, env: string): () => NodeJS.ReadWriteStream {
	const esmConfig = getEsmConfiguration(env)
	const title = 'babel-esm'
	return function execute() {
		return gulp
			.src(BABEL_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(babel(esmConfig))
			.pipe(verbose ? debug({ title }) : noopStep())
			.pipe(gulp.dest('dist/esm'))
			.on('end', () => subtaskSuccess(title))
			.on('error', () => subtaskFail(title))
	}
}

export function buildBabel(debug: boolean, env: string) {
	return () => gulp.parallel(babelEsm(debug, env), babelCjs(debug, env))
}
/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchBabel(debug: boolean, env: string) {
	return gulp.watch(BABEL_GLOBS, buildBabel(debug, env))
}
