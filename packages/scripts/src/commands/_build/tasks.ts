/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import { generateTypedocsGulp } from '@essex/build-step-typedoc'
import { compile as compileTypescript } from '@essex/build-step-typescript'
import { noopTask } from '@essex/build-utils'
import gulp from 'gulp'
import { BuildCommandOptions } from './types'

const cwd = process.cwd()
const tsConfigPath = join(cwd, 'tsconfig.json')

export function configureTasks({
	verbose = false,
	docs = false,
	env = 'production',
	stripInternalTypes = false,
}: BuildCommandOptions): gulp.TaskFunction {
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const generateDocs = docs ? generateTypedocsGulp(verbose) : noopTask
	const compileTS = compileTypescript(stripInternalTypes)

	return gulp.series(
		generateDocs,
		//
		// The primary transpilation pipeline
		//  tsc -> babel -> bundlers
		//
		gulp.series(compileTS),
	)
}
