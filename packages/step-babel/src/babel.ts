/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { FSWatcher } from 'fs'
import gulp from 'gulp'
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import { BABEL_GLOB, createTransformTask } from './transform'

/**
 * Transpiles babel from lib/ into dist/esm and dist/cjs
 * @param env
 * @param listen
 */
export function buildBabel(env: string): gulp.TaskFunction {
	return babelTasks(env, false)
}

/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchBabel(env: string): FSWatcher {
	return gulp.watch([BABEL_GLOB], babelTasks(env, true))
}

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
function babelCjs(env: string, swallowErrors: boolean): gulp.TaskFunction {
	const root = 'dist/cjs'
	return createTransformTask(
		'babel-cjs',
		root,
		getCjsConfiguration(env),
		swallowErrors,
	)
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
function babelEsm(env: string, swallowErrors: boolean): gulp.TaskFunction {
	const root = 'dist/esm'
	return createTransformTask(
		'babel-esm',
		root,
		getEsmConfiguration(env),
		swallowErrors,
	)
}

function babelTasks(env: string, swallowErrors: boolean) {
	return gulp.parallel(
		babelEsm(env, swallowErrors),
		babelCjs(env, swallowErrors),
	)
}
