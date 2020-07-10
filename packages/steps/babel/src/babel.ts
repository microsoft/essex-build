/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import { noop } from '@essex/build-util-noop'
import * as debug from 'gulp-debug'

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
export function babelCjs(
	verbose: boolean,
	env: string,
): () => NodeJS.ReadWriteStream {
	const cjsConfig = getCjsConfiguration(env)
	return () =>
		gulp
			.src(['lib/**/*.js'])
			.pipe(babel(cjsConfig))
			.pipe(verbose ? debug({ title: 'babel-cjs' }) : noop())
			.pipe(gulp.dest('dist/cjs'))
			.on('end', () => subtaskSuccess('babel-cjs'))
			.on('error', () => subtaskFail('babel-cjs'))
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
export function babelEsm(
	verbose: boolean,
	env: string,
): () => NodeJS.ReadWriteStream {
	const esmConfig = getEsmConfiguration(env)
	return () =>
		gulp
			.src(['lib/**/*.js'])
			.pipe(babel(esmConfig))
			.pipe(verbose ? debug({ title: 'babel-esm' }) : noop())
			.pipe(gulp.dest('dist/esm'))
			.on('end', () => subtaskSuccess('babel-esm'))
			.on('error', () => subtaskFail('babel-esm'))
}
