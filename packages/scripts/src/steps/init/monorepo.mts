/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { writeFileSync } from 'fs'

import {
	TARGET_PACKAGE_JSON_PATH,
	readTargetPackageJson,
} from '../../util/package.mjs'
import * as log from '../../util/tasklogger.mjs'
import { copyConfigFile } from './util.mjs'

const INIT_INSTRUCTIONS = `
To utilize the essex build system, you should define scripts in your package.json file that utilize the build system.
`
const INIT_MSG_FAIL = `
Not all configuration has been copied to the target location, as it already exists. 
Check the logs for more details.

${INIT_INSTRUCTIONS}
`

const CONFIG_FILES_DOT = [
	'docsignore',
	'docsrc.json',
	'gitignore',
	'linstagedrc.json',
]
const CONFIG_FILES_NODOT = [
	'tsconfig.json',
	'jest.config.js',
	'babel.config.js',
]

export function initMonorepo(): Promise<number> {
	return Promise.resolve()
		.then(() =>
			Promise.all([
				configurePackageJsonForMonorepo(),
				...CONFIG_FILES_DOT.map((f) => copyConfigFile(f, true)),
				...CONFIG_FILES_NODOT.map((f) => copyConfigFile(f, false)),
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

async function configurePackageJsonForMonorepo(): Promise<number> {
	const pkgJson = await readTargetPackageJson()
	let writeNeeded = false
	let scripts = pkgJson.scripts
	if (!scripts) {
		scripts = pkgJson.scripts = {}
	}
	if (!scripts['preinstall']) {
		scripts['preinstall'] = 'npx only-allow yarn'
		writeNeeded = true
	}
	if (!scripts['postinstall']) {
		scripts['postinstall'] = 'husky install'
		writeNeeded = true
	}
	if (!scripts['build:all']) {
		scripts['build:all'] =
			'yarn workspaces foreach -pivt --topological-dev run build'
		writeNeeded = true
	}
	if (!scripts['test:all']) {
		scripts['test:all'] = 'yarn workspaces foreach -piv run test'
		writeNeeded = true
	}
	if (!scripts['clean:all']) {
		scripts['clean:all'] = 'yarn workspaces foreach -piv run clean'
		writeNeeded = true
	}
	if (!scripts['start:all']) {
		scripts['start:all'] = 'yarn workspaces foreach -piv run start'
		writeNeeded = true
	}
	if (!scripts['publish:all']) {
		scripts['publish:all'] =
			"yarn workspaces foreach --exclude '<YOUR_TOP_LEVEL_PACKAGE_NAME>' -pv npm publish --tolerate-republish --access public"
	}
	if (!scripts['unit:test']) {
		scripts['unit:test'] = 'jest'
		writeNeeded = true
	}
	if (!scripts['lint:all']) {
		scripts['lint:all'] = 'essex lint --fix'
		writeNeeded = true
	}
	if (!scripts['git_is_clean']) {
		scripts['git_is_clean'] = 'essex git-is-clean'
		writeNeeded = true
	}
	if (!scripts['ci']) {
		scripts['ci'] = 'run-s build:all test:all lint:all unit:test git_is_clean'
		writeNeeded = true
	}
	if (writeNeeded) {
		writeFileSync(TARGET_PACKAGE_JSON_PATH, JSON.stringify(pkgJson, null, 2))
	}
	log.info(`
	You should install these recommended peer dependencies

	-- Essex Configs --
	@essex/scripts

	-- Build Tooling --
	npm-run-all 

	-- Required for Jest testing --
	@essex/babel-config
	@essex/jest-config
	`)
	return Promise.resolve(0)
}
