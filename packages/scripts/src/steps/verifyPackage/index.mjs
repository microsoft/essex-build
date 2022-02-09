import { readTargetPackageJson } from '../../util/package.mjs'
import { error, subtaskSuccess, warn } from '../../util/tasklogger.mjs'

export async function verifyPackage() {
	const pkg = await readTargetPackageJson()

	// Main should point to dist/cjs/index.js
	if (pkg.main !== 'dist/cjs/index.js') {
		error('pkg.main should be "dist/cjs/index.js" for legacy module support')
		throw new Error()
	}
	if (!pkg.types) {
		error('pkg.types should "dist/types/index.d.ts" for legacy typings support')
		throw new Error()
	}
	if (!pkg.exports) {
		error('package.exports should be an object')
		throw new Error()
	}
	if (pkg.exports.import !== './dist/esm/index.mjs') {
		error('package.exports.import should be "./dist/esm/index.mjs"')
		throw new Error()
	}
	if (pkg.exports.require !== './dist/cjs/index.js') {
		error('package.exports.require should be "./dist/esm/index.mjs"')
		throw new Error()
	}
	if (pkg.exports.types !== './dist/types/index.d.ts') {
		error('package.exports.types should be "./dist/types/index.d.ts"')
		throw new Error()
	}
	if (pkg.module) {
		warn('package.module should be removed')
	}
	subtaskSuccess('verify package.json')
}
