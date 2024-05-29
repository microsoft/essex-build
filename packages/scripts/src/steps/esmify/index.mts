/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs/promises'
import { walk } from '../../util/walk.mjs'

const has = (l: string, search: string) => l.indexOf(search) !== -1
const isLocalImport = (l: string) =>
	has(l, 'import ') && has(l, './') && has(l, ".js'")
const isLocalExport = (l: string) =>
	has(l, 'export ') && has(l, './') && has(l, ".js'")
const isSourceMap = (l: string) =>
	has(l, '//# sourceMappingURL=') && has(l, ".js'")
export async function esmify(rewriteToMjs: boolean, dir: string) {
	await walk(dir, async (entryPath) => {
		if (entryPath.endsWith('.js')) {
			await rewriteImports(entryPath, rewriteToMjs)
			if (rewriteToMjs) await renameJsToMjs(entryPath)
		}
	})
}

function renameJsToMjs(entryPath: string) {
	const newPath = entryPath.replace('.js', '.mjs')
	return fs.rename(entryPath, newPath)
}

async function rewriteImports(entryPath: string, rewriteToMjs: boolean) {
	const content = await fs.readFile(entryPath, 'utf8')
	const rewritten = rewriteFile(content, rewriteToMjs)
	if (rewritten !== content) {
		await fs.writeFile(entryPath, rewriteFile(content, rewriteToMjs), 'utf8')
	}
}

function rewriteFile(content: string, rewriteToMjs: boolean): string {
	return content
		.split('\n')
		.map((l) => rewriteLine(l, rewriteToMjs))
		.join('\n')
}

function rewriteLine(l: string, rewriteToMjs: boolean): string {
	if (
		rewriteToMjs &&
		(isLocalImport(l) || isLocalExport(l) || isSourceMap(l))
	) {
		return l.replace('.js', '.mjs')
	}
	return l
}
