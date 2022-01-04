/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import * as swc from '@swc/core'
export async function compile(fileNames: string[]): Promise<number> {
	const transpilePromises = fileNames.map(async filename => {
		const code = await new Promise<string>((resolve, reject) =>
			fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
				if (err) {
					reject(err)
				} else {
					resolve(data)
				}
			}),
		)
		await swc.transform(code, {
			filename,
			sourceMaps: true,
			isModule: true,
		})
	})

	await Promise.all(transpilePromises)
	return 0
}

/*

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

	*/
