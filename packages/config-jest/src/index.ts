/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { resolve } from '@essex/jest-config/resolve'
import { getSwcOptions } from '@essex/swc-opts'

export interface EssexJestOptions {
	/**
	 * The jest setup files to include
	 * default (if jest.setup.js exists) = ['<rootDir>/jest.setup.js']
	 * default (if jest.setup.js does not exist) = []
	 *
	 * This argument will be used in place of the default
	 */
	setupFiles: string[]

	/**
	 * Whether to rewrite lodash-es imports to lodash, default = true
	 */
	rewriteLodashEs: boolean
}

export function configure({
	setupFiles = getSetupFiles(),
	rewriteLodashEs = true,
}: Partial<EssexJestOptions> = {}): any {
	const result: any = {
		transform: {
			'^.+\\.(t|j)sx?$': [resolve('@swc/jest'), getSwcOptions()],
		},
		testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
		rootDir: process.cwd(),
		roots: [process.cwd()],
		resolver: resolve('@essex/jest-config/resolver'),
		extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
		moduleNameMapper: {
			'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
				'@essex/jest-config/filemock',
			'\\.(css|less|scss|sass)$': resolve('identity-obj-proxy'),
		},
		collectCoverageFrom: [
			'**/src/**/*.{js,jsx,ts,tsx}',
			'!**/node_modules/**',
			'!**/vendor/**',
			'!**/dist/**',
			'!**/lib/**',
			'!**/build/**',
			'!**/assets/**',
			'!**/__tests__/**',
			'!.yarn/**',
		],
		coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
		setupFilesAfterEnv: setupFiles,
	}

	if (rewriteLodashEs) {
		// lodash-es presents issues in test, even when running in experimental ESM mode. Hacky fix is to use main lodash at test time
		result.moduleNameMapper['^lodash-es/(.*)$'] = resolve('lodash').replace(
			'lodash.js',
			'$1',
		)
	}

	return result
}

/**
 * Gets the setupFiles to use
 */
function getSetupFiles(): string[] {
	const setupFile = join(process.cwd(), 'jest.setup.js')
	return existsSync(setupFile) ? ['<rootDir>/jest.setup.js'] : []
}
