/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import depcheck from 'depcheck'

import { subtaskFail } from '../util/tasklogger.mjs'

export function checkDeps({ ignore = [] }: { ignore?: string[] }) {
	const options = {
		ignoreBinPackage: true, // ignore the packages with bin entry
		skipMissing: false, // skip calculation of missing dependencies
		ignorePatterns: [
			// files matching these patterns will be ignored
			'docs',
			'docsTemp',
			'storybook_static',
			'build',
			'dist',
			'lib',
		],
		ignoreMatches: [
			// common polyfill libraries, injected by build stack
			'tslib',
			'core-js',
			// shareable tsconfigs are never used directly
			'@essex/tsconfig*',
			'@tsconfig/*',
			// invisible dependencies, rarely imported directly
			'@types/react',
			'@types/node',
			'react',
			'react-dom',
			// Storybook dependencies
			'@mdx-js/react',
			'@storybook/addon-docs',
			'@storybook/addon-essentials',
			// Testing Dependencies
			'@types/jest',
			'jest-environment*',
			...ignore,
		],
		parsers: {
			'**/*.js': depcheck.parser.es6,
			'**/*.mjs': depcheck.parser.es6,
			'**/*.cjs': depcheck.parser.es6,
			'**/*.jsx': depcheck.parser.jsx,
			'**/*.ts': depcheck.parser.typescript,
			'**/*.tsx': depcheck.parser.typescript,
			'**/*.mts': depcheck.parser.typescript,
			'**/*.cts': depcheck.parser.typescript,
		},
		detectors: [
			// the target detectors
			depcheck.detector.requireCallExpression,
			depcheck.detector.importDeclaration,
		],
		specials: [
			// the target special parsers
			depcheck.special.eslint,
			depcheck.special.webpack,
			depcheck.special.bin,
		],
	}

	return depcheck(process.cwd(), options).then((unused) => {
		if (
			unused.dependencies.length === 0 &&
			unused.devDependencies.length === 0
		) {
			return
		}
		unused.dependencies.forEach((d) => {
			subtaskFail(`unused dependency: ${d}`)
		})
		unused.devDependencies.forEach((d) => {
			subtaskFail(`unused dev-dependency: ${d}`)
		})
		throw new Error('unused dependencies detected')
	})
}
