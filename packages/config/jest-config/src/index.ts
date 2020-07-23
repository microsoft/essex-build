/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import { defaults } from 'jest-config'

const jestSetupPath = join(process.cwd(), 'jest.setup.js')

const tsConfigFileOverride = join(process.cwd(), 'tsconfig.jest.json')
const tsConfigFile = existsSync(tsConfigFileOverride)
	? tsConfigFileOverride
	: join(__dirname, '../config/tsconfig.jest.json')

const emptyMock = join(__dirname, 'filemock.js')

const config = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.[tj]sx?$': 'ts-jest',
	},
	testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'json'],
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
	setupFilesAfterEnv: existsSync(jestSetupPath) ? [jestSetupPath] : [],
	globals: {
		'ts-jest': {
			tsConfig: tsConfigFile,
		},
	},
}

export default config
