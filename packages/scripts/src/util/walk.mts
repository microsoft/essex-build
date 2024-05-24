/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import path from 'path'
import fs from 'fs/promises'

export async function walk(
	dir: string,
	handleFile: (file: string) => Promise<void>,
) {
	const entries = await fs.readdir(dir)

	for (const entry of entries) {
		const entryPath = path.join(dir, entry)
		const stat = await fs.stat(entryPath)
		if (stat.isDirectory()) {
			await walk(entryPath, handleFile)
		} else {
			await handleFile(entryPath)
		}
	}
}
