/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'

const SETUP_FILE = join(process.cwd(), 'jest.setup.js')

/**
 * Gets the setupFiles to use
 */
export function getSetupFiles(): string[] {
	return existsSync(SETUP_FILE) ? ['<rootDir>/jest.setup.js'] : []
}
