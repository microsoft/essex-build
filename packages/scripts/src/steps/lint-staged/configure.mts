/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Job } from '@essex/shellrunner'
import { readTargetPackageJson } from '../../util/package.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const defaultConfigPath = path.join(
	__dirname,
	'../../../config/lintstagedrc.json',
)
const configFileOptions = [
	path.join(process.cwd(), '.lintstagedrc'),
	path.join(process.cwd(), '.lintstagedrc.js'),
	path.join(process.cwd(), '.lintstagedrc.json'),
	path.join(process.cwd(), '.lintstagedrc.yml'),
	path.join(process.cwd(), '.lintstagedrc.yaml'),
	path.join(process.cwd(), 'lintstagedrc.config.js'),
]

export async function configureJob(): Promise<Job> {
	return {
		exec: 'lint-staged',
		args: (await isLintStagedConfigured()) ? [] : ['-c', defaultConfigPath],
	}
}

async function isLintStagedConfigured(): Promise<boolean> {
	const pkgJson = await readTargetPackageJson()
	return pkgJson['lint-staged'] || configFileOptions.some(t => existsSync(t))
}
