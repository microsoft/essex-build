/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ts from 'typescript'
import { isDebug } from '../../util/isDebug.mjs'
import { checkAndEmitTypings } from './checkAndEmitTypings.mjs'
import { compile as compileTS } from './compile.mjs'
import { getSourceFiles } from './getSourceFiles.mjs'

const logFiles = isDebug()

export async function compile(stripInternal: boolean): Promise<void> {
	if (isDebug()) {
		console.log('Using TypeScript version ', ts.version)
	}
	const sourceFiles = await getSourceFiles()
	await compileTS(sourceFiles, logFiles)
	await checkAndEmitTypings(sourceFiles, stripInternal)
}
