/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'

const releaseConfig = join(__dirname, '../../config/eslintrc-release')
const experimentConfig = join(__dirname, '../../config/eslintrc-experiment')
const projectConfig = join(process.cwd(), '.eslintrc')

export function getConfigFile(strict: boolean): string {
	if (existsSync(projectConfig)) {
		return projectConfig
	}
	return strict ? releaseConfig : experimentConfig
}

export function getIgnorePath(): string {
	const defaultIgnore = join(__dirname, '../../config/eslintignore')
	const projectIgnore = join(process.cwd(), '.eslintignore')
	return existsSync(projectIgnore) ? projectIgnore : defaultIgnore
}
