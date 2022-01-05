/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { compile as compileTypescript } from '@essex/build-step-typescript'

import { BuildCommandOptions } from './types'

const cwd = process.cwd()
const tsConfigPath = join(cwd, 'tsconfig.json')

export function executeBuild({
	verbose = false,
	docs = false,
	env = 'production',
	stripInternalTypes = false,
}: BuildCommandOptions): Promise<void> {
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const generateDocs = docs ? generateTypedocs(verbose) : Promise.resolve()
	const compileTS = compileTypescript(stripInternalTypes)

	return Promise.all([generateDocs, compileTS]).then()
}
