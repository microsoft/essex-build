/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import chalk from 'chalk'
import ts from 'typescript'
import {
	printPerf,
	subtaskSuccess,
	subtaskFail,
} from '../../util/tasklogger.mjs'
import { loadTSConfig, parseTSConfig } from './config.mjs'

export async function checkAndEmitTypings(
	fileNames: string[],
	stripInternal: boolean,
	esmOnly: boolean,
): Promise<number> {
	const start = performance.now()
	const config = await loadTSConfig()
	const options = {
		...parseTSConfig(config),
		declaration: true,
		emitDeclarationOnly: true,
		stripInternal,
		outDir: esmOnly ? 'dist' : 'dist/types',
	}

	const program = ts.createProgram(fileNames, options)
	const emitResult = program.emit()
	const allDiagnostics = ts
		.getPreEmitDiagnostics(program)
		.concat(emitResult.diagnostics)

	let hasErrors = false
	allDiagnostics.forEach(diagnostic => {
		if (diagnostic.file && diagnostic.start) {
			if (diagnostic.category === ts.DiagnosticCategory.Error) {
				hasErrors = true
			}
			const { line, character } = ts.getLineAndCharacterOfPosition(
				diagnostic.file,
				diagnostic.start,
			)
			const message = ts.flattenDiagnosticMessageText(
				diagnostic.messageText,
				'\n',
			)
			console.log(
				chalk.red(
					`${diagnostic.file.fileName} (${line + 1},${
						character + 1
					}): ${message}`,
				),
			)
		} else {
			console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
		}
	})

	if (hasErrors) {
		subtaskFail('typings')
		throw new Error(`typings failure`)
	}
	subtaskSuccess('typings', printPerf(start))
	return emitResult.emitSkipped ? 1 : 0
}
