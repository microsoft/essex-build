/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { subtaskSuccess, subtaskFail, printPerf } from '@essex/tasklogger'
import gulp from 'gulp'
import ts from 'typescript'
import { compile as compileTS } from './compile'
import { getSourceFiles } from './getSourceFiles'
import { checkAndEmitTypings } from './checkAndEmitTypings'

function getBuildTask(
	stripInternal: boolean,
	logFiles: boolean,
	listen: boolean,
): gulp.TaskFunction {
	const title = 'compile'
	return async function execute(): Promise<void> {
		if (process.env.ESSEX_DEBUG) {
			console.log('Using TypeScript version ', ts.version)
		}
		const start = performance.now()
		try {
			const sourceFiles = await getSourceFiles()
			await compileTS(sourceFiles, logFiles)
			await checkAndEmitTypings(sourceFiles, stripInternal)
			subtaskSuccess(`${title} ${printPerf(start)}`)
		} catch (err) {
			subtaskFail(`${title} ${printPerf(start)}`)
			if (listen) {
				throw err
			}
		}
	}
}

/**
 * Emits typings files into dist/types
 */
export function compile(stripInternal: boolean): gulp.TaskFunction {
	return getBuildTask(stripInternal, !!process.env.ESSEX_DEBUG, true)
}
