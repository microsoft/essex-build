/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export function isTsConfigPathsConfigured(): boolean {
	const tsconfigJsonPath = join(process.cwd(), 'tsconfig.json')
	if (existsSync(tsconfigJsonPath)) {
		const tsconfig = require(tsconfigJsonPath) as {
			compilerOptions?: { paths?: any }
		}
		if (tsconfig?.compilerOptions?.paths) {
			return true
		}
	}
	return false
}
