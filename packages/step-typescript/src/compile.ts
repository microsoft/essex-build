/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as ts from 'typescript'

export function compile(
	fileNames: string[],
	options: ts.CompilerOptions,
): number {
	const program = ts.createProgram(fileNames, options)
	const emitResult = program.emit()
	const allDiagnostics = ts
		.getPreEmitDiagnostics(program)
		.concat(emitResult.diagnostics)

	allDiagnostics.forEach(diagnostic => {
		if (diagnostic.file && diagnostic.start) {
			const { line, character } = ts.getLineAndCharacterOfPosition(
				diagnostic.file,
				diagnostic.start,
			)
			const message = ts.flattenDiagnosticMessageText(
				diagnostic.messageText,
				'\n',
			)
			console.log(
				`${diagnostic.file.fileName} (${line + 1},${
					character + 1
				}): ${message}`,
			)
		} else {
			console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
		}
	})

	return emitResult.emitSkipped ? 1 : 0
}
