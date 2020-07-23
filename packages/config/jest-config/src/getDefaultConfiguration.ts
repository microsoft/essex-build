/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import { defaults } from 'jest-config'
import { getSetupFiles, getTsConfigFile } from './overrides'

export function getDefaultConfiguration(): any {
	const emptyMock = join(__dirname, 'filemock.js')

	return {
		preset: 'ts-jest',
		transform: {
			'^.+\\.[tj]sx?$': 'ts-jest',
		},
		testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
		moduleFileExtensions: [
			...defaults.moduleFileExtensions,
			'ts',
			'tsx',
			'json',
		],
		testEnvironment: 'jsdom',
		rootDir: process.cwd(),
		testResultsProcessor: 'jest-junit-reporter',
		moduleNameMapper: {
			'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': emptyMock,
			'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		},
		collectCoverageFrom: [
			'**/src/**/*.{js,jsx,ts,tsx}',
			'!**/node_modules/**',
			'!**/vendor/**',
			'!**/dist/**',
			'!**/lib/**',
			'!**/assets/**',
			'!**/__tests__/**',
		],
		coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
		setupFilesAfterEnv: getSetupFiles(),
		globals: {
			'ts-jest': {
				tsConfig: getTsConfigFile(),
			},
		},
	}
}
