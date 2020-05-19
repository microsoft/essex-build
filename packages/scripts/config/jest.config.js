/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { existsSync } = require('fs')
const { join } = require('path')
const { defaults } = require('jest-config')

const jestSetupPath = join(process.cwd(), 'jest.setup.js')
const setupFiles = existsSync(jestSetupPath) ? [jestSetupPath] : []

const tsConfigFileOverride = join(process.cwd(), 'tsconfig.jest.json')
const tsConfigFile = existsSync(tsConfigFileOverride)
	? tsConfigFileOverride
	: join(__dirname, 'tsconfig.jest.json')

module.exports = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.[tj]sx?$': 'ts-jest',
		'^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
	},
	testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'json'],
	testEnvironment: 'jsdom',
	rootDir: process.cwd(),
	testResultsProcessor: 'jest-junit-reporter',
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': join(
			__dirname,
			'jest.filemock.js',
		),
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
	setupFilesAfterEnv: setupFiles,
	globals: {
		'ts-jest': {
			tsConfig: tsConfigFile,
		},
	},
}
