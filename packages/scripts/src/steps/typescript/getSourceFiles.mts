/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import glob from 'glob'

import { difference } from './sets.mjs'

const SOURCE_GLOB = 'src/**/*.ts*'
const TEST_GLOB = 'src/**/__tests__/**'

/**
 * Get a set of source files to compile
 * @returns
 */
export async function getSourceFiles(): Promise<string[]> {
	const [sourceFiles, testFiles] = await Promise.all([
		resolveGlob(SOURCE_GLOB),
		resolveGlob(TEST_GLOB),
	])
	const diff = difference(sourceFiles, testFiles)
	return [...diff.values()]
}

function resolveGlob(globSpec: string): Promise<Set<string>> {
	return new Promise((resolve, reject) => {
		glob(globSpec, (err, res) => {
			if (err) {
				reject(err)
			} else {
				const fileSet = new Set<string>()
				res.forEach(r => fileSet.add(r))
				resolve(fileSet)
			}
		})
	})
}
