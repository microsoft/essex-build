/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import * as gulp from 'gulp'
import * as babel from 'gulp-babel'
import { existsSync } from 'fs'
import { join } from 'path'
import {
	babelCjs as defaultCjs,
	babelEsm as defaultEsm,
} from './default-config'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import { noop } from '@essex/build-util-noop'
import * as debug from 'gulp-debug'

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
export function babelCjs(verbose: boolean): () => NodeJS.ReadWriteStream {
	const cjsOverridePath = join(process.cwd(), 'babelrc.cjs.js')
	const cjsConfig = existsSync(cjsOverridePath)
		? require(cjsOverridePath)
		: defaultCjs

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
export function babelEsm(verbose: boolean): () => NodeJS.ReadWriteStream {
	const esmOverridePath = join(process.cwd(), 'babelrc.esm.js')
	const esmConfig = existsSync(esmOverridePath)
		? require(esmOverridePath)
		: defaultEsm
	return () =>
		gulp
			.src(['lib/**/*.js'])
			.pipe(babel(esmConfig))
			.pipe(verbose ? debug({ title: 'babel-esm' }) : noop())
			.pipe(gulp.dest('dist/esm'))
			.on('end', () => subtaskSuccess('babel-esm'))
			.on('error', () => subtaskFail('babel-esm'))
}
