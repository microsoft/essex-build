/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'

const JEST_OVERRIDE = join(process.cwd(), 'jest.config.js')
const OVERRIDE_TSCONFIG = join(process.cwd(), 'tsconfig.jest.json')
const SETUP_FILE = join(process.cwd(), 'jest.setup.js')

export function getJestConfigOverride(): any | undefined {
	return existsSync(JEST_OVERRIDE) ? require(JEST_OVERRIDE) : undefined
}

/**
 * Gets the ts-jest TSConfig to use
 */
export function getTsConfigFile(): string | any {
	if (existsSync(OVERRIDE_TSCONFIG)) {
		return '<rootDir>/tsconfig.jest.json'
	} else {
		return {
			module: 'CommonJS',
			target: 'ES2015',
			moduleResolution: 'Node',
			jsx: 'react',
			forceConsistentCasingInFileNames: true,
			declaration: false,
			esModuleInterop: true,
			allowSyntheticDefaultImports: true,
			allowJs: true,
			resolveJsonModule: true,
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
			lib: ['esnext', 'dom'],
			types: ['node', 'jest'],
		}
	}
}

/**
 * Gets the setupFiles to use
 */
export function getSetupFiles(): string[] {
	return existsSync(SETUP_FILE) ? ['<rootDir>/jest.setup.js'] : []
}
