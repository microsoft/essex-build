/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import crlf from 'crlf'
import glob from 'glob'

/**
 * Fixes line endings to LF in the given file glob.
 * @param globPattern - The files pattern to write
 * @returns
 */
export function fixLineEndings(globPattern: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		glob(globPattern, (err, files) => {
			if (err) {
				reject(err)
			} else {
				const xforms = files.map(recodeFile)
				const allXforms = Promise.all(xforms).then(() => {
					/*nada*/
				})
				resolve(allXforms)
			}
		})
	})
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
