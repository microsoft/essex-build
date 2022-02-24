/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import glob from 'glob'

export async function buildMdIndex(include: string): Promise<void> {
	console.log('A', include)
	const fileList = await getMarkdownFiles(include)
	fileList.forEach(filePath => {
		console.log('FILE', filePath)
	})
	console.log('B')
}

function getMarkdownFiles(include: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		glob(`${include}/**/*.md`, (err, res) => {
			if (err) {
				console.error(err)
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}
