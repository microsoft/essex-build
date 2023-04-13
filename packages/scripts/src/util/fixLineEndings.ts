/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import crlf from 'crlf'
import { glob } from 'glob'

/**
 * Fixes line endings to LF in the given file glob.
 * @param globPattern - The files pattern to write
 * @returns
 */
export async function fixLineEndings(globPattern: string): Promise<void> {
	const files = await glob(globPattern)
	await Promise.all(files.map(recodeFile))
}

function recodeFile(file: string) {
	return new Promise<void>((resolve, reject) =>
		crlf.set(file, 'LF', (err: Error) => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		}),
	)
}
