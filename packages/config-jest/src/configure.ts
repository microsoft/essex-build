/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { resolve } from '@essex/jest-config/resolve'
import { getSwcOptions } from '@essex/swc-opts'
import { getSetupFiles } from './overrides.js'

export function configure(
	esm: boolean,
	setupFiles: string[] = getSetupFiles(),
): any {
	const result: any = {
		transform: {
			'^.+\\.(t|j)sx?$': [resolve('@swc/jest'), getSwcOptions()],
		},
		testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
		rootDir: process.cwd(),
		roots: [process.cwd()],
		resolver: resolve('@essex/jest-config/resolver'),
		moduleNameMapper: {
			'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
				'@essex/jest-config/filemock',
			'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
			// lodash-es presents issues in test, even when running in experimental ESM mode. Hacky fix is to use
			// main lodash at test time
			'^lodash-es/(.*)$': 'lodash/$1',
		},
		collectCoverageFrom: [
			'**/src/**/*.{js,jsx,ts,tsx}',
			'!**/node_modules/**',
			'!**/vendor/**',
			'!**/dist/**',
			'!**/lib/**',
			'!**/assets/**',
			'!**/__tests__/**',
			'!.yarn/**',
		],
		coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
		setupFilesAfterEnv: setupFiles,
	}

	if (esm) {
		result.extensionsToTreatAsEsm = ['.ts', '.tsx']
	}

	return result
}
