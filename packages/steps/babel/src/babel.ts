/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { FSWatcher } from 'fs'
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import * as debug from 'gulp-debug'

const BABEL_GLOBS = ['lib/**/*.js']

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
function babelCjs(env: string, listen = true): gulp.TaskFunction {
	const cjsConfig = getCjsConfiguration(env)
	const title = 'babel-cjs'
	return function execute() {
		const task: NodeJS.ReadWriteStream = gulp
			.src(BABEL_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(babel(cjsConfig))
			.pipe(debug({ title }))
			.pipe(gulp.dest('dist/cjs'))

		if (listen) {
			task.on('end', () => subtaskSuccess(title))
			task.on('error', () => subtaskFail(title))
		}
		return task
	}
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
function babelEsm(env: string, listen = true): gulp.TaskFunction {
	const esmConfig = getEsmConfiguration(env)
	const title = 'babel-esm'
	return function execute() {
		const task: NodeJS.ReadWriteStream = gulp
			.src(BABEL_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(babel(esmConfig))
			.pipe(debug({ title }))
			.pipe(gulp.dest('dist/esm'))

		if (listen) {
			task.on('end', () => subtaskSuccess(title))
			task.on('error', () => subtaskFail(title))
		}
		return task
	}
}

/**
 * Transpiles babel from lib/ into dist/esm and dist/cjs
 * @param env
 * @param listen
 */
export function buildBabel(env: string, listen = true): gulp.TaskFunction {
	return gulp.parallel(babelEsm(env, listen), babelCjs(env, listen))
}
/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchBabel(env: string): FSWatcher {
	return gulp.watch(BABEL_GLOBS, buildBabel(env, false))
}
