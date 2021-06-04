/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import {
	subtaskSuccess,
	subtaskFail,
	printPerf,
	traceFile,
} from '@essex/tasklogger'
import gulp from 'gulp'
import ts, { FileWatcher } from 'typescript'
import { compile as compileTS } from './compile'
import { loadTSConfig, parseTSConfig } from './config'
import { getSourceFiles } from './getSourceFiles'

const TYPESCRIPT_GLOBS = ['src/**/*.ts*', '!**/__tests__/**']

function getBuildTask(
	stripInternal: boolean,
	logFiles: boolean,
	listen: boolean,
): gulp.TaskFunction {
	const title = 'tsc'
	return async function execute(): Promise<void> {
		if (process.env.ESSEX_DEBUG) {
			console.log('Using TypeScript version ', ts.version)
		}
		const start = performance.now()
		try {
			const [sourceFiles, config] = await Promise.all([
				getSourceFiles(),
				loadTSConfig(),
			])
			if (logFiles) {
				sourceFiles.forEach(file => traceFile(file, title))
			}
			const options = parseTSConfig(config)
			// transpile task
			const result = compileTS(sourceFiles, options)
			// emit types to dist/ folder; no emit expected
			compileTS(sourceFiles, {
				...options,
				declaration: true,
				emitDeclarationOnly: true,
				stripInternal,
				outDir: 'dist/types',
			})
			const end = performance.now()
			if (result === 0) {
				subtaskSuccess(`${title} ${printPerf(start, end)}`)
			} else {
				throw new Error(`tsc did not emit anything`)
			}
		} catch (err) {
			const end = performance.now()
			subtaskFail(`${title} ${printPerf(start, end)}`)
			if (listen) {
				throw err
			}
		}
	}
}

/**
 * Watches typescript from src/ to the lib/ folder
 */
export function watchTypescript(stripInternalTypes: boolean): FileWatcher {
	return gulp.watch(
		TYPESCRIPT_GLOBS,
		gulp.parallel(getBuildTask(stripInternalTypes, true, false)),
	)
}

/**
 * Emits typings files into dist/types
 */
export function compile(stripInternal: boolean): gulp.TaskFunction {
	return getBuildTask(stripInternal, !!process.env.ESSEX_DEBUG, true)
}
