import {
	readPublishedPackageJson,
	readTargetPackageJson,
} from '../../util/package.mjs'
import { subtaskSuccess, warn } from '../../util/tasklogger.mjs'
import { BuildMode } from '../../types.mjs'

const note = `Encountered package verification errors. Note that these may be fixed directly or using the "pkg.publishConfig" field used by yarn.
`
export async function verifyPackage(mode: BuildMode) {
	const raw = await readTargetPackageJson()
	const pkg = await readPublishedPackageJson()
	switch (mode) {
		case BuildMode.dual:
			verifyDualMode(pkg)
			break
		case BuildMode.esm:
			verifyEsmMode(pkg, raw)
			break
		case BuildMode.legacy:
			verifyLegacyMode(pkg)
			break
	}
	subtaskSuccess('verify package.json')
}

function verifyEsmMode(pkg: any, raw: any) {
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

function verifyDualMode(pkg: any) {
	if (pkg.module) {
		warn('package.module should be removed')
	}

	const errors: string[] = []
	invariant(
		pkg.main === 'dist/cjs/index.js',
		'pkg.main should be "dist/cjs/index.js" for legacy module support',
		errors,
	)
	invariant(pkg.exports, 'package.exports should be an object', errors)
	invariant(
		pkg.exports.import === './dist/esm/index.mjs',
		'package.exports.import should be "./dist/esm/index.mjs"',
		errors,
	)
	invariant(
		pkg.exports.require === './dist/cjs/index.js',
		'package.exports.require should be "./dist/esm/index.mjs"',
		errors,
	)
	invariant(
		pkg.exports.types === './dist/types/index.d.ts',
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

function verifyLegacyMode(pkg: any) {
	const errors: string[] = []
	invariant(
		pkg.main === 'dist/cjs/index.js',
		'pkg.main should be "dist/cjs/index.js" for legacy module support',
		errors,
	)
	invariant(
		pkg.module === 'dist/esm/index.js',
		'package.module should be "dist/esm/index.mjs"',
		errors,
	)
	invariant(
		pkg.types === 'dist/types/index.d.ts',
		'package.types should be "dist/types/index.d.ts"',
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
