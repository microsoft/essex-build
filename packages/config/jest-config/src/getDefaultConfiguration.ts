/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getSetupFiles, getTsConfigFile } from './overrides'

export function getDefaultConfiguration(): any {
	return {
		preset: 'ts-jest',
		transform: {
			'^.+\\.[tj]sx?$': 'ts-jest',
		},
		testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
		testResultsProcessor: 'jest-junit-reporter',
		rootDir: process.cwd(),
		roots: [process.cwd()],
		moduleNameMapper: {
			'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
				'@essex/jest-config/lib/filemock',
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
