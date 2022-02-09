/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import path from 'path'

import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const releaseConfig = path.join(__dirname, '../../../config/eslintrc-release')
const experimentConfig = path.join(__dirname, '../../../config/eslintrc-experiment')
const projectConfig = path.join(process.cwd(), '.eslintrc')

export function getConfigFile(strict: boolean): string {
	if (existsSync(projectConfig)) {
		return projectConfig
	}
	return strict ? releaseConfig : experimentConfig
}

export function getIgnorePath(): string {
	const defaultIgnore = path.join(__dirname, '../../../config/eslintignore')
	const projectIgnore = path.join(process.cwd(), '.eslintignore')
	return existsSync(projectIgnore) ? projectIgnore : defaultIgnore
}
