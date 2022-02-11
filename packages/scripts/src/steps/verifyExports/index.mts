import { readPublishedPackageJson } from '../../util/package.mjs'
import { createRequire } from 'module'
import path from 'path'
import { performance } from 'perf_hooks'
import { fileUrl } from '../../util/fileUrl.mjs'
import * as logger from '../../util/tasklogger.mjs'
import get from 'lodash/get.js'
import { checkApi } from './checkApi.mjs'

const require = createRequire(import.meta.url)

export async function verifyExports(esmOnly: boolean): Promise<void> {
	const pkg = await readPublishedPackageJson()

	const expected = get(pkg, 'essex.exports')
	if (expected == null) {
		logger.warn(
			`    essex.exports not defined in package.json; skipping named export verification`,
		)
	}

	doChecks('verify esm export', async () => {
		// pkg.exports.imports is used in dual mode; pkg.main is used in esm-only mode
		const api = await loadEsm(esmEntry(pkg))
		if (expected) checkApi(api, expected)
	})
	if (!esmOnly) {
		doChecks('verify cjs export', async () => {
			const api = await loadCjs(cjsEntry(pkg))
			if (expected) checkApi(api, expected)
		})
	}
}

function esmEntry(pkg: any): string {
	return tryEntries(pkg, 'exports.import', 'exports[.].import', 'main')
}

function cjsEntry(pkg: any): string {
	return tryEntries(pkg, 'exports.require', 'exports[.].require', 'main')
}

function tryEntries(pkg: any, ...entries: string[]) {
	for (const entry of entries) {
		const entryValue = get(pkg, entry)
		if (entryValue) {
			return entryValue
		}
	}

	throw new Error('could not locate entrypoint')
}

async function loadEsm(pkgName: string): Promise<Record<string, unknown>> {
	return import(fileUrl(path.join(process.cwd()), pkgName))
}

async function loadCjs(pkgName: string): Promise<Record<string, any>> {
	return require(path.join(process.cwd(), pkgName))
}

async function doChecks(task: string, callback: () => Promise<void>) {
	try {
		const start = performance.now()
		await callback()
		logger.subtaskSuccess(task, logger.printPerf(start))
	} catch (err) {
		logger.subtaskFail(task)
		throw err
	}
}
