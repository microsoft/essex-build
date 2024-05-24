/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createRequire } from 'node:module'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import get from 'lodash/get.js'

import { fileUrl } from '../../util/fileUrl.mjs'
import type { PackageJsonData } from '../../util/package.mjs'
import { readPublishedPackageJson } from '../../util/package.mjs'
import {
	printPerf,
	subtaskFail,
	subtaskSuccess,
	warn,
} from '../../util/tasklogger.mjs'
import { checkApi } from './checkApi.mjs'

const require = createRequire(import.meta.url)

export async function verifyExports(esmOnly: boolean): Promise<void> {
	const pkg = await readPublishedPackageJson()

	const expected = pkg?.essex?.exports
	if (expected == null) {
		warn(
			'    essex.exports not defined in package.json; skipping named export verification',
		)
	}

	await doChecks('verify esm export', async () => {
		// pkg.exports.imports is used in dual mode; pkg.main is used in esm-only mode
		const api = await loadEsm(esmEntry(pkg))
		if (expected) {
			checkApi(api, expected)
		}
	})
	if (!esmOnly) {
		await doChecks('verify cjs export', async () => {
			const api = await loadCjs(cjsEntry(pkg))
			if (expected) {
				checkApi(api, expected)
			}
		})
	}
}

function esmEntry(pkg: PackageJsonData): string {
	return tryEntries(pkg, 'exports.import', 'exports[.].import', 'main')
}

function cjsEntry(pkg: PackageJsonData): string {
	return tryEntries(pkg, 'exports.require', 'exports[.].require', 'main')
}

function tryEntries(pkg: PackageJsonData, ...entries: string[]): string {
	for (const entry of entries) {
		const entryValue: string = get(pkg, entry) as string
		if (entryValue) {
			return entryValue
		}
	}

	throw new Error('could not locate entrypoint')
}

function loadEsm(pkgName: string): Promise<Record<string, unknown>> {
	return import(fileUrl(path.join(process.cwd()), pkgName)) as Promise<
		Record<string, unknown>
	>
}

async function loadCjs(pkgName: string): Promise<Record<string, unknown>> {
	await Promise.resolve()
	return require(path.join(process.cwd(), pkgName)) as Record<string, unknown>
}

async function doChecks(task: string, callback: () => Promise<void>) {
	try {
		const start = performance.now()
		await callback()
		subtaskSuccess(task, printPerf(start))
	} catch (err) {
		subtaskFail(task)
		throw err
	}
}
