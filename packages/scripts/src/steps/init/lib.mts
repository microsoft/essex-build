/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { writeFile } from 'fs/promises'

import {
	TARGET_PACKAGE_JSON_PATH,
	readTargetPackageJson,
} from '../../util/package.mjs'
import * as log from '../../util/tasklogger.mjs'
import { copyConfigFile } from './util.mjs'

const INIT_MSG_FAIL = 'An error occurred initializing the library'
const INIT_INSTRUCTIONS = `Congratulations! The package has been configured as TypeScript library. 

Please ensure that the "typescript" dependency is installed as a devDependency either in this package or the monoreporo root if applicable. 

If you are in a monorepo context, you may need to update your tsconfig.json file to extend from the monorepo root's tsconfig.json
`

async function configurePackageJsonForLib(): Promise<number> {
	const pkgJson = await readTargetPackageJson()
	if (!pkgJson.scripts) {
		pkgJson.scripts = {}
	}
	let writeNeeded = false
	if (!pkgJson.scripts.build) {
		pkgJson.scripts.build = 'essex build'
		writeNeeded = true
	}
	if (!pkgJson.scripts.clean) {
		pkgJson.scripts.clean = 'essex clean'
		writeNeeded = true
	}
	if (!pkgJson.scripts.start) {
		pkgJson.scripts.start = 'essex watch'
		writeNeeded = true
	}
	if (!pkgJson.main) {
		pkgJson.main = 'dist/cjs/index.js'
		writeNeeded = true
	}
	if (!pkgJson.module) {
		pkgJson.module = 'dist/esm/index.js'
		writeNeeded = true
	}
	if (!pkgJson.types) {
		pkgJson.types = 'dist/types/index.d.ts'
		writeNeeded = true
	}
	if (writeNeeded) {
		await writeFile(TARGET_PACKAGE_JSON_PATH, JSON.stringify(pkgJson, null, 2))
	}
	return Promise.resolve(0)
}

export function initLib(): Promise<number> {
	return Promise.resolve()
		.then(() =>
			Promise.all([
				copyConfigFile('tsconfig.json'),
				configurePackageJsonForLib(),
			]),
		)
		.then((results) => {
			const result = results.reduce((a, b) => a + b, 0)
			if (result > 0) {
				log.info(INIT_MSG_FAIL)
			} else {
				log.info(INIT_INSTRUCTIONS)
			}
			return result
		})
}
