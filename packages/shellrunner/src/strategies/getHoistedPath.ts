/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { platform } from 'os'
import { join, resolve } from 'path'
import { existsSync } from 'fs'
import * as log from '../log'

const sep = platform().indexOf('win') === 0 ? ';' : ':'

/**
 * Get the path with yarn hoisting.
 * This is necessary because Yarn v2 does not hoist bins into the path
 */
export function getHoistedPath(): string {
	const currentPath = process.env.PATH
	const binPaths = getNodeModulesBinPaths()
	const result = [...binPaths, currentPath].join(sep)
	log.debug('hoisted path:', result)
	return result
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
