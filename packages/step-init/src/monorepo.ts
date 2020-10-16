/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { writeFileSync } from 'fs'
import { join } from 'path'
import { copyConfigFile } from './util'
import { recipes } from '@essex/build-step-recipes'
import * as log from '@essex/tasklogger'

const pkgJsonPath = join(process.cwd(), 'package.json')
const pkgJson = require(pkgJsonPath)

const INIT_INSTRUCTIONS = `
To utilize the essex build system, you should define scripts in your package.json file that utilize the build system. Here are some examples:

${recipes}
`
const INIT_MSG_FAIL = `
Not all configuration has been copied to the target location, as it already exists. 
Check the logs for more details.

${INIT_INSTRUCTIONS}
`

const CONFIG_FILES_DOT = [
	'docsignore',
	'docsrc.json',
	'eslintignore',
	'eslintrc.json',
	'gitignore',
	'linstagedrc.json',
	'prettierignore',
]
const CONFIG_FILES_NODOT = ['tsconfig.json', 'jest.config.js']

export function initMonorepo(): Promise<number> {
	return Promise.resolve()
		.then(() =>
			Promise.all([
				configurePackageJsonForMonorepo(),
				...CONFIG_FILES_DOT.map(f => copyConfigFile(f, true)),
				...CONFIG_FILES_NODOT.map(f => copyConfigFile(f, false)),
			]),
		)
		.then(results => {
			const result = results.reduce((a, b) => a + b, 0)
			if (result > 0) {
				log.info(INIT_MSG_FAIL)
			} else {
				log.info(INIT_INSTRUCTIONS)
			}
			return result
		})
}

function configurePackageJsonForMonorepo(): Promise<number> {
	let writeNeeded = false
	if (!pkgJson.prettier) {
		pkgJson.prettier = '@essex/prettier-config'
		writeNeeded = true
	}
	if (!pkgJson.husky) {
		pkgJson.husky = {
			hooks: {
				'pre-commit': 'essex pre-commit',
			},
		}
		writeNeeded = true
	}

	if (!pkgJson.scripts['build_all']) {
		pkgJson.scripts['build_all'] =
			'yarn workspaces foreach -pivt --topological-dev run build'
		writeNeeded = true
	}
	if (!pkgJson.scripts['test_all']) {
		pkgJson.scripts['test_all'] = 'yarn workspaces foreach -piv run test'
		writeNeeded = true
	}
	if (!pkgJson.scripts['clean_all']) {
		pkgJson.scripts['clean_all'] = 'yarn workspaces foreach -piv run clean'
		writeNeeded = true
	}
	if (!pkgJson.scripts.start) {
		pkgJson.scripts.start = 'yarn workspaces foreach -piv run start'
		writeNeeded = true
	}
	if (!pkgJson.scripts['unit_test']) {
		pkgJson.scripts['unit_test'] = 'essex test'
		writeNeeded = true
	}
	if (!pkgJson.scripts.lint) {
		pkgJson.scripts.lint = 'essex lint --docs --fix'
		writeNeeded = true
	}
	if (!pkgJson.scripts['publish_all']) {
		pkgJson.scripts['publish_all'] =
			"yarn workspaces foreach --exclude '<YOUR_TOP_LEVEL_PACKAGE_NAME>' -pv npm publish --tolerate-republish --access public"
	}
	if (!pkgJson.scripts['git_is_clean']) {
		pkgJson.scripts['git_is_clean'] = 'essex git-is-clean'
		writeNeeded = true
	}
	if (!pkgJson.scripts['ci']) {
		pkgJson.scripts['ci'] =
			'run-s build_all test_all lint unit_test git_is_clean'
		writeNeeded = true
	}
	if (writeNeeded) {
		writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
	}
	log.info(`
	You should install these recommended peer dependencies

	npm-run-all husky lint-staged @commitlint/cli @typescript-eslint/eslint-plugin @typescript-eslint/eslint-parser eslint-import-resolver-node
	`)
	return Promise.resolve(0)
}
