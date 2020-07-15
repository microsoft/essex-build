/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { noopStep } from '@essex/build-utils'
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'
import * as gulp from 'gulp'
import * as debug from 'gulp-debug'
import * as ts from 'gulp-typescript'

const TYPESCRIPT_GLOBS = ['src/**/*.ts*', '!**/__tests__/**']

/**
 * Compiles typescript from src/ to the lib/ folder
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export function compileTypescript(
	verbose: boolean,
): () => NodeJS.ReadWriteStream {
	const project = createTsProject()
	const title = 'tsc'
	return function execute() {
		return gulp
			.src(TYPESCRIPT_GLOBS, { since: gulp.lastRun(execute) })
			.pipe(project())
			.pipe(verbose ? debug({ title }) : noopStep())
			.pipe(gulp.dest('lib'))
			.on('end', () => subtaskSuccess(title))
			.on('error', () => subtaskFail(title))
	}
}

/**
 * Emits typings files into dist/types
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export function emitTypings(verbose: boolean): () => NodeJS.ReadWriteStream {
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
			.pipe(verbose ? debug({ title }) : noopStep())
			.pipe(gulp.dest('dist/typings'))
			.on('end', () => subtaskSuccess(title))
			.on('error', () => subtaskFail(title))
	}
}

/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchTypescript(debug: boolean) {
	return gulp.watch(TYPESCRIPT_GLOBS, gulp.series(compileTypescript(debug)))
}

function createTsProject(overrides?: ts.Settings | undefined) {
	const cwd = process.cwd()
	const tsConfigPath = join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json file must exist')
	}

	return ts.createProject(tsConfigPath, overrides)
}
