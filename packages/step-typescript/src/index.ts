/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import gulp from 'gulp'
import debug from 'gulp-debug'
import plumber from 'gulp-plumber'
import ts from 'gulp-typescript'
import merge2 from 'merge2'
import typescript, { FileWatcher } from 'typescript'
import { noopStep } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail, printPerf } from '@essex/tasklogger'

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
	const title = 'tsc'
	return function execute(): NodeJS.ReadWriteStream {
		const start = performance.now()
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
				.pipe(logFiles ? debug({ title: 'ts:dts' }) : noopStep())
				.pipe(gulp.dest('dist/types')),
			task.js
				.pipe(logFiles ? debug({ title: 'ts:js' }) : noopStep())
				.pipe(gulp.dest('lib/')),
		])

		if (listen) {
			task
				.on('end', () => {
					const end = performance.now()
					subtaskSuccess(`${title} ${printPerf(start, end)}`)
				})
				.on('error', err => {
					const end = performance.now()
					subtaskFail(`${title} ${printPerf(start, end)}`)
					console.error(err)
					throw new Error(`error encountered in ${title}`)
				})
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
