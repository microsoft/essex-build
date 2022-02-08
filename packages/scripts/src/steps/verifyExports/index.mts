import { readTargetPackageJson } from '../../util/package.mjs'
import { createRequire } from 'module'
import path from 'path'
import { performance } from 'perf_hooks'
import { fileUrl } from '../../util/fileUrl.mjs'
import * as logger from '../../util/tasklogger.mjs'

const require = createRequire(import.meta.url)

export async function verifyExports(): Promise<void> {
	const pkg = await readTargetPackageJson()

	const expected = pkg['essex:exports']
	if (!expected) {
		throw new Error(
			`package.json must contain an "essex:exports" property. This object should have keys for each named export and values of 'typeof <exported>'`,
		)
	}
	try {
		const start = performance.now()
		await verifyEsm(pkg.exports.import, expected)
		logger.subtaskSuccess('verify esm exports', logger.printPerf(start))
	} catch (err) {
		logger.subtaskFail('verify esm exports')
	}
	try {
		const start = performance.now()
		await verifyCjs(pkg.exports.require, expected)
		logger.subtaskSuccess('verify cjs exports', logger.printPerf(start))
	} catch (err) {
		logger.subtaskFail('verify cjs exports')
	}
}

async function verifyEsm(
	pkgName: string,
	expected: Record<string, any>,
): Promise<void> {
	const api = await import(fileUrl(path.join(process.cwd()), pkgName))
	check(api, expected)
}

async function verifyCjs(pkgName: string, expected: Record<string, any>) {
	const api = require(path.join(process.cwd(), pkgName))
	check(api, expected)
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
