/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { platform } from 'os'
import { join, resolve } from 'path'
import { existsSync } from 'fs'

const sep = platform().indexOf('win') === 0 ? ';' : ':'

/**
 * Get the path with yarn hoisting.
 * This is necessary because Yarn v2 does not hoist bins into the path
 */
export function getHoistedPath(): string {
	const currentPath = process.env.PATH
	const nmBins = getNodeModulesBinPaths()
	return [...nmBins, currentPath].join(sep)
}

function getNodeModulesBinPaths(): string[] {
	const result: string[] = []
	let curDir = process.cwd()
	let keepGoing = true
	do {
		const current = join(curDir, 'node_modules', '.bin')
		if (existsSync(current)) {
			result.push(current)
		}
		const parent = resolve(current, '..')

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
