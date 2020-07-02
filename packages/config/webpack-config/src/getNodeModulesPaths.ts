/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join, resolve } from 'path'
import { existsSync } from 'fs'

export function getNodeModulesPaths(): string[] {
	const result: string[] = []
	let curDir = process.cwd()
	let keepGoing = true
	do {
		const current = join(curDir, 'node_modules')
		if (existsSync(current)) {
			result.push(current)
		}
		const parent = resolve(curDir, '..')

		// If we bottom out in the fs, stop recursing
		if (parent === curDir) {
			keepGoing = false
		}

		// If we reach a workspaces boundary, stop recursing
		const curPkgJson = join(curDir, 'package.json')
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		if (existsSync(curPkgJson) && require(curPkgJson).workspaces != null) {
			keepGoing = false
		}

		curDir = parent
	} while (keepGoing)
	return result
}
