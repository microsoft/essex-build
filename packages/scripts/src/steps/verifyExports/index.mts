import { readTargetPackageJson } from '../../util/package.mjs'
import { createRequire } from 'module'
import path from 'path'
import { performance } from 'perf_hooks'
import { fileUrl } from '../../util/fileUrl.mjs'
import * as logger from '../../util/tasklogger.mjs'
import get from 'lodash/get.js'

const require = createRequire(import.meta.url)

export async function verifyExports(esmOnly: boolean): Promise<void> {
	const pkg = await readTargetPackageJson()

	const expected = get(pkg, 'essex.exports')
	if (expected == null) {
		logger.warn(
			`    essex.exports not defined in package.json; skipping named export verification`,
		)
	}

	doChecks('verify esm export', async () => {
		// pkg.exports.imports is used in dual mode; pkg.main is used in esm-only mode
		const api = await loadEsm(esmEntry(pkg))
		if (expected) check(api, expected)
	})
	if (!esmOnly) {
		doChecks('verify cjs export', async () => {
			const api = await loadCjs(cjsEntry(pkg))
			if (expected) check(api, expected)
		})
	}
}

function esmEntry(pkg: any): string {
	let result = null
	if (pkg.exports) {
		if (pkg.exports.import) {
			result = pkg.exports.import
		} else if (pkg.exports['.']) {
			result = pkg.exports['.'].import
		}
	} else {
		result = pkg.main
	}

	if (!result) {
		throw new Error('could not locate esm entrypoint')
	}
	return result
}

function cjsEntry(pkg: any): string {
	let result = null
	if (pkg.exports) {
		if (pkg.exports.require) {
			result = pkg.exports.require
		} else if (pkg.exports['.']) {
			result = pkg.exports['.'].require
		}
	} else {
		result = pkg.main
	}

	if (!result) {
		throw new Error('could not locate esm entrypoint')
	}
	return result
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

async function loadEsm(pkgName: string): Promise<Record<string, unknown>> {
	return import(fileUrl(path.join(process.cwd()), pkgName))
}

async function loadCjs(pkgName: string): Promise<Record<string, any>> {
	return require(path.join(process.cwd(), pkgName))
}

export function check(
	imported: Record<string, unknown>,
	expected: Record<string, string>,
): void {
	Object.keys(imported).forEach(key => {
		if (!expected[key]) {
			throw new Error(
				`unexpected export "${key}" of type ${typeof imported[key]}`,
			)
		}
		const expectedType = expected[key]
		const actualType = typeof imported[key]

		if (expectedType !== actualType) {
			throw new Error(
				`export type mismatch on key "${key}: expected ${expectedType}, got ${actualType}`,
			)
		}
	})
	Object.keys(expected).forEach(key => {
		if (!imported[key]) {
			throw new Error(`missing export: ${key} of type ${expected[key]}`)
		}
	})
}
