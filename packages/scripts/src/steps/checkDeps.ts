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
			// ignore dependencies that matches these globs
			'@essex/tsconfig*',
			'@types/jest',
			'@types/react',
			'@types/node',
			'react',
			...ignore,
		],
		parsers: {
			'**/*.js': depcheck.parser.es6,
			'**/*.jsx': depcheck.parser.jsx,
			'**/*.ts': depcheck.parser.typescript,
			'**/*.tsx': depcheck.parser.typescript,
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
