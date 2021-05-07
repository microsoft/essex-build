/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { FSWatcher } from 'fs'
import gulp from 'gulp'
import babel from 'gulp-babel'
import debug from 'gulp-debug'
import plumber from 'gulp-plumber'
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import { noopStep } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'

const BABEL_GLOBS = ['lib/**/*.js']

function createErrorHandler(title: string, listen: boolean) {
	return function onError(err?: Error | undefined) {
		console.error('Babel Error', err)
		if (listen) {
			subtaskFail(title, err)
			throw new Error(`babel transpile error`)
		}
	}
}

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
function babelCjs(
	env: string,
	logFiles: boolean,
	listen: boolean,
): gulp.TaskFunction {
	const cjsConfig = getCjsConfiguration(env)
	const title = 'babel-cjs'
	return function execute() {
		const handleError = createErrorHandler(title, listen)
		const task: NodeJS.ReadWriteStream = gulp
			.src(BABEL_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(
				plumber({
					errorHandler: !listen,
				}),
			)
			.pipe(babel(cjsConfig))
			.on('error', handleError)
			.pipe(logFiles ? debug({ title }) : noopStep())
			.pipe(gulp.dest('dist/cjs'))

		if (listen) {
			task.on('end', (...args) => {
				subtaskSuccess(title)
			})
			task.on('error', handleError)
		}
		return task
	}
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
function babelEsm(
	env: string,
	logFiles: boolean,
	listen: boolean,
): gulp.TaskFunction {
	const esmConfig = getEsmConfiguration(env)
	const title = 'babel-esm'
	return function execute() {
		const handleError = createErrorHandler(title, listen)
		const task: NodeJS.ReadWriteStream = gulp
			.src(BABEL_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(
				plumber({
					errorHandler: !listen,
				}),
			)
			.pipe(babel(esmConfig))
			.on('error', handleError)
			.pipe(logFiles ? debug({ title }) : noopStep())
			.pipe(gulp.dest('dist/esm'))

		if (listen) {
			task.on('end', (...args) => {
				subtaskSuccess(title)
			})
			task.on('error', handleError)
		}
		return task
	}
}

function babelTasks(env: string, logFiles: boolean, listen: boolean) {
	return gulp.parallel(
		babelEsm(env, logFiles, listen),
		babelCjs(env, logFiles, listen),
	)
}

/**
 * Transpiles babel from lib/ into dist/esm and dist/cjs
 * @param env
 * @param listen
 */
export function buildBabel(env: string): gulp.TaskFunction {
	return babelTasks(env, !!process.env.ESSEX_DEBUG, true)
}
/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchBabel(env: string): FSWatcher {
	return gulp.watch(BABEL_GLOBS, babelTasks(env, true, false))
}
