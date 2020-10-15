/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import * as gulp from 'gulp'
import * as debug from 'gulp-debug'
import * as plumber from 'gulp-plumber'
import * as ts from 'gulp-typescript'
import { FileWatcher } from 'typescript'
import { noopStep } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'

const TYPESCRIPT_GLOBS = ['src/**/*.ts*', '!**/__tests__/**']

function createTsProject(overrides?: ts.Settings | undefined) {
	const cwd = process.cwd()
	const tsConfigPath = join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json file must exist')
	}

	return ts.createProject(tsConfigPath, overrides)
}

function executeCompile(logFiles: boolean, listen: boolean): gulp.TaskFunction {
	const project = createTsProject()
	const title = 'tsc'
	return function execute(): NodeJS.ReadWriteStream {
		const task = gulp
			.src(TYPESCRIPT_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(
				plumber({
					errorHandler: !listen,
				}),
			)
			.pipe(project())
			.pipe(logFiles ? debug({ title }) : noopStep())
			.pipe(gulp.dest('lib'))

		if (listen) {
			task.on('end', () => subtaskSuccess(title))
			task.on('error', () => subtaskFail(title))
		}
		return task
	}
}

function executeTypeEmit(
	stripInternal: boolean,
	logFiles: boolean,
	listen: boolean,
): gulp.TaskFunction {
	const project = createTsProject({
		declaration: true,
		emitDeclarationOnly: true,
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
			.pipe(logFiles ? debug({ title }) : noopStep())
			.pipe(gulp.dest('dist/types'))

		if (listen) {
			task
				.on('end', () => subtaskSuccess(title))
				.on('error', () => subtaskFail(title))
		}
		return task
	}
}

/**
 * Compiles typescript from src/ to the lib/ folder
 */
export function compileTypescript(): gulp.TaskFunction {
	return executeCompile(false, true)
}

/**
 * Watches typescript from src/ to the lib/ folder
 */
export function watchTypescript(stripInternalTypes: boolean): FileWatcher {
	return gulp.watch(
		TYPESCRIPT_GLOBS,
		gulp.parallel(
			executeCompile(true, false),
			executeTypeEmit(stripInternalTypes, true, false),
		),
	)
}

/**
 * Emits typings files into dist/types
 */
export function emitTypings(stripInternal: boolean): gulp.TaskFunction {
	return executeTypeEmit(stripInternal, false, true)
}
