import { readTargetPackageJson } from '../../util/package.mjs'
import { error, subtaskSuccess, warn } from '../../util/tasklogger.mjs'
import { BuildMode } from '../../types.mjs'

export async function verifyPackage(mode: BuildMode) {
	const pkg = await readTargetPackageJson()

	if (pkg.module) {
		warn('package.module should be removed')
	}

	switch (mode) {
		case BuildMode.dual:
			verifyDualMode(pkg)
			break
		case BuildMode.esm:
			verifyEsmMode(pkg)
			break
		case BuildMode.legacy:
			warn('not performing package verification in legacy mode')
			break
	}
	subtaskSuccess('verify package.json')
}

function verifyEsmMode(pkg: any) {
	invariant(
		pkg.main === 'dist/index.js',
		'package.main should be "dist/index.js"',
	)
	invariant(pkg.type === 'module', 'package.type should be "module"')
	invariant(
		pkg.types === 'dist/index.d.ts',
		'package.main should be "dist/index.d.ts"',
	)
}

function verifyDualMode(pkg: any) {
	invariant(
		pkg.main === 'dist/cjs/index.js',
		'pkg.main should be "dist/cjs/index.js" for legacy module support',
	)
	invariant(pkg.exports, 'package.exports should be an object')
	invariant(
		pkg.exports.import === './dist/esm/index.mjs',
		'package.exports.import should be "./dist/esm/index.mjs"',
	)
	invariant(
		pkg.exports.require === './dist/cjs/index.js',
		'package.exports.require should be "./dist/esm/index.mjs"',
	)
	invariant(
		pkg.exports.types === './dist/types/index.d.ts',
		'package.exports.types should be "./dist/types/index.d.ts"',
	)
	invariant(
		pkg.types === 'dist/types/index.d.ts',
		'pkg.types should "dist/types/index.d.ts" for typings support',
	)
}

function invariant(check: boolean, message: string) {
	if (!check) {
		error(message)
		throw new Error(message)
	}
}
