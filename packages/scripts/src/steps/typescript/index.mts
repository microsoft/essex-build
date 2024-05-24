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

export async function compile(
	stripInternal: boolean,
	esmOnly: boolean,
): Promise<void> {
	if (isDebug()) {
		console.info('Using TypeScript version ', ts.version)
	}
	const sourceFiles = await getSourceFiles()
	await compileTS(sourceFiles, logFiles, esmOnly)
	await checkAndEmitTypings(sourceFiles, stripInternal, esmOnly)
}
