/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BuildMode } from '../../types.mjs'
import type { PackageJsonData } from '../../util/package.mjs'
import {
	readPublishedPackageJson,
	readTargetPackageJson,
} from '../../util/package.mjs'
import { subtaskSuccess, warn } from '../../util/tasklogger.mjs'

const note = `Encountered package verification errors. Note that these may be fixed directly or using the "pkg.publishConfig" field used by yarn.
`
export async function verifyPackage(mode: BuildMode) {
	const raw = await readTargetPackageJson()
	const pkg = await readPublishedPackageJson()
	switch (mode) {
		case BuildMode.Dual: {
			verifyDualMode(pkg)
			break
		}
		case BuildMode.Esm: {
			verifyEsmMode(pkg, raw)
			break
		}
		default:
			throw new Error(`unknown mode "${mode as string}"`)
	}
	subtaskSuccess('verify package.json')
}

function verifyEsmMode(pkg: PackageJsonData, raw: PackageJsonData) {
	if (pkg.module) {
		warn('package.module should be removed')
	}

	const errors: string[] = []
	invariant(
		pkg.main === 'dist/index.js',
		'package.main should be "dist/index.js"',
		errors,
	)
	invariant(
		raw.type === 'module',
		'package.type should be "module" (outside publishConfig)',
		errors,
	)
	invariant(
		pkg.types === 'dist/index.d.ts',
		'package.main should be "dist/index.d.ts"',
		errors,
	)

	if (errors.length > 0) {
		throw new Error(note + errors.join('\n'))
	}
}

function verifyDualMode(pkg: PackageJsonData) {
	if (pkg.module) {
		warn('package.module should be removed')
	}

	const errors: string[] = []
	invariant(pkg.exports != null, 'package.exports should be an object', errors)
	invariant(
		pkg.exports?.import === './dist/esm/index.mjs',
		'package.exports.import should be "./dist/esm/index.mjs"',
		errors,
	)
	invariant(
		pkg.exports?.require === './dist/cjs/index.js',
		'package.exports.require should be "./dist/esm/index.mjs"',
		errors,
	)
	invariant(
		pkg.exports?.types === './dist/types/index.d.ts',
		'package.exports.types should be "./dist/types/index.d.ts"',
		errors,
	)
	invariant(
		pkg.types === 'dist/types/index.d.ts',
		'pkg.types should "dist/types/index.d.ts" for typings support',
		errors,
	)

	if (errors.length > 0) {
		throw new Error(note + errors.join('\n'))
	}
}

function invariant(check: boolean, message: string, errs: string[]) {
	if (!check) {
		errs.push(message)
	}
}
