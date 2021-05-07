/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import gulp from 'gulp'
import debug from 'gulp-debug'
import plumber from 'gulp-plumber'
import ts from 'gulp-typescript'
import { FileWatcher } from 'typescript'
import { noopStep } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import typescript from 'typescript'
import merge2 from 'merge2'

const TYPESCRIPT_GLOBS = ['src/**/*.ts*', '!**/__tests__/**']

function createTsProject(overrides?: ts.Settings | undefined) {
	const cwd = process.cwd()
	const tsConfigPath = join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json file must exist')
	}

	return ts.createProject(tsConfigPath, { typescript, ...overrides })
}

function executeTS(
	stripInternal: boolean,
	logFiles: boolean,
	listen: boolean,
): gulp.TaskFunction {
	const project = createTsProject({
		declaration: true,
		stripInternal,
	})
	const title = 'typings'
	return function execute(): NodeJS.ReadWriteStream {
		const task = gulp
			.src(TYPESCRIPT_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(
				plumber({
					errorHandler: !listen,
				}),
			)
			.pipe(project())

		merge2([
			task.dts
				.pipe(logFiles ? debug({ title: 'typings' }) : noopStep())
				.pipe(gulp.dest('dist/types')),
			task.js
				.pipe(logFiles ? debug({ title: 'ts' }) : noopStep())
				.pipe(gulp.dest('lib/'))
		])

		if (listen) {
			task
				.on('end', () => subtaskSuccess(title))
				.on('error', () => subtaskFail(title))
		}
		return task
	}
}

/**
 * Watches typescript from src/ to the lib/ folder
 */
export function watchTypescript(stripInternalTypes: boolean): FileWatcher {
	return gulp.watch(
		TYPESCRIPT_GLOBS,
		gulp.parallel(executeTS(stripInternalTypes, true, false)),
	)
}

/**
 * Emits typings files into dist/types
 */
export function compile(stripInternal: boolean): gulp.TaskFunction {
	return executeTS(stripInternal, !!process.env.ESSEX_DEBUG, true)
}
