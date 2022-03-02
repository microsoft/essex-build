/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'

export function isTsConfigPathsConfigured(): boolean {
	const tsconfigJsonPath = join(process.cwd(), 'tsconfig.json')
	if (existsSync(tsconfigJsonPath)) {
		const tsconfig = require(tsconfigJsonPath)
		if (tsconfig?.compilerOptions?.paths) {
			return true
		}
	}
	return false
}
