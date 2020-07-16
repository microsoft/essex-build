/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as gulp from 'gulp'
import * as debug from 'gulp-debug'
import * as ts from 'gulp-typescript'
import { FileWatcher } from 'typescript'

const TYPESCRIPT_GLOBS = ['src/**/*.ts*', '!**/__tests__/**']

/**
 * Compiles typescript from src/ to the lib/ folder
 */
export function compileTypescript(listen = true): () => NodeJS.ReadWriteStream {
	const project = createTsProject()
	const title = 'tsc'
	return function execute(): NodeJS.ReadWriteStream {
		const task = gulp
			.src(TYPESCRIPT_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(project())
			.pipe(debug({ title }))
			.pipe(gulp.dest('lib'))

		if (listen) {
			task.on('end', () => subtaskSuccess(title))
			task.on('error', () => subtaskFail(title))
		}
		return task
	}
}

/**
 * Emits typings files into dist/types
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export function emitTypings(): () => NodeJS.ReadWriteStream {
	const project = createTsProject({
		declaration: true,
		emitDeclarationOnly: true,
		stripInternal: true,
	})
	const title = 'typings'
	return function execute() {
		return gulp
			.src(TYPESCRIPT_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(project())
			.pipe(debug({ title }))
			.pipe(gulp.dest('dist/types'))
			.on('end', () => subtaskSuccess(title))
			.on('error', () => subtaskFail(title))
	}
}

/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchTypescript(): FileWatcher {
	return gulp.watch(TYPESCRIPT_GLOBS, gulp.series(compileTypescript()))
}

function createTsProject(overrides?: ts.Settings | undefined) {
	const cwd = process.cwd()
	const tsConfigPath = join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json file must exist')
	}

	return ts.createProject(tsConfigPath, overrides)
}
