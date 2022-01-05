/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import ts from 'typescript'
import { subtaskSuccess, subtaskFail, printPerf } from '../../util/tasklogger'
import { checkAndEmitTypings } from './checkAndEmitTypings'
import { compile as compileTS } from './compile'
import { getSourceFiles } from './getSourceFiles'

const title = 'compile'
const logFiles = !!process.env.ESSEX_DEBUG

export async function compile(stripInternal: boolean): Promise<void> {
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
		throw err
	}
}
