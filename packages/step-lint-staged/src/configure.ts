/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { Job } from '@essex/shellrunner'

const pkgJsonPath = join(process.cwd(), 'package.json')
const defaultConfigPath = join(__dirname, '../config/lintstagedrc.json')
const configFileOptions = [
	join(process.cwd(), '.lintstagedrc'),
	join(process.cwd(), '.lintstagedrc.js'),
	join(process.cwd(), '.lintstagedrc.json'),
	join(process.cwd(), '.lintstagedrc.yml'),
	join(process.cwd(), '.lintstagedrc.yaml'),
	join(process.cwd(), 'lintstagedrc.config.js'),
]

export function configureJob(): Job {
	return {
		exec: 'lint-staged',
		args: isLintStagedConfigured() ? [] : ['-c', defaultConfigPath],
	}
}

function isLintStagedConfigured(): boolean {
	const pkgJson = getPackageJson()
	return pkgJson['lint-staged'] || configFileOptions.some(t => existsSync(t))
}

function getPackageJson(): any {
	return existsSync(pkgJsonPath) ? require(pkgJsonPath) : {}
}
