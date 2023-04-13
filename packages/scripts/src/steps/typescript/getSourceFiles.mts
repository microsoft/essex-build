/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { glob } from 'glob'

const SOURCE_GLOB = 'src/**/*.ts*'

/**
 * Get a set of source files to compile
 * @returns
 */
export async function getSourceFiles(): Promise<string[]> {
	const sourceFiles = [...(await resolveGlob(SOURCE_GLOB))]
	return sourceFiles.filter(
		(t) =>
			t.indexOf('/__tests__/') === -1 &&
			t.indexOf('.spec.') === -1 &&
			t.indexOf('.test.') === -1 &&
			t.indexOf('.stories.') === -1,
	)
}

async function resolveGlob(globSpec: string): Promise<Set<string>> {
	const found = await glob(globSpec)
	const fileSet = new Set<string>()
	found.forEach((r) => fileSet.add(r))
	return fileSet
}
