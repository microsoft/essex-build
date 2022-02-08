/* eslint-disable */
import fs from 'fs/promises'
import { walk } from '../../util/walk.mjs'

const has = (l: string, search: string) => l.indexOf(search) !== -1
const isLocalImport = (l: string) =>
	has(l, 'import ') && has(l, './') && has(l, '.js\'')
const isLocalExport = (l: string) =>
	has(l, 'export ') && has(l, './') && has(l, '.js\'')
const isSourceMap = (l: string) =>
	has(l, '//# sourceMappingURL=') && has(l, '.js\'')
const isReactImport = (l: string) => has(l, 'react/jsx-runtime')

export async function esmify(dir: string) {
	await walk(dir, async entryPath => {
		if (entryPath.endsWith('.js')) {
			await rewriteJsReferencesToMjs(entryPath)
		}
		if (entryPath.indexOf('.js') >= 0) {
			await renameJsToMjs(entryPath)
		}
	})
}

function renameJsToMjs(entryPath: string) {
	const newPath = entryPath.replace('.js', '.mjs')
	console.log(`${entryPath} => ${newPath}`)
	return fs.rename(entryPath, newPath)
}

async function rewriteJsReferencesToMjs(entryPath: string) {
	const content = await fs.readFile(entryPath, 'utf8')
	await fs.writeFile(entryPath, rewriteFile(content), 'utf8')
}

function rewriteFile(content: string): string {
	return content.split('\n').map(rewriteLine).join('\n')
}

function rewriteLine(l: string): string {
	if (isLocalImport(l) || isLocalExport(l) || isSourceMap(l)) {
		return l.replace('.js', '.mjs')
	}
	if (isReactImport(l)) {
		return l.replace('react/jsx-runtime', 'react/jsx-runtime.js')
	}
	return l
}
