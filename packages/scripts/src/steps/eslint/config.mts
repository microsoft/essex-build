/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const eslintConfig = path.join(__dirname, '../../../config/eslintrc')
const projectConfig = path.join(process.cwd(), '.eslintrc')

export function getConfigFile(): string {
	if (existsSync(projectConfig)) {
		return projectConfig
	}
	return eslintConfig
}

export function getIgnorePath(): string {
	const defaultIgnore = path.join(__dirname, '../../../config/eslintignore')
	const projectIgnore = path.join(process.cwd(), '.eslintignore')
	return existsSync(projectIgnore) ? projectIgnore : defaultIgnore
}
