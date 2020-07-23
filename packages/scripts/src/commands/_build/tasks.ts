/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync } from 'fs'
import { join } from 'path'
import { buildBabel } from '@essex/build-step-babel'
import { generateTypedocsGulp } from '@essex/build-step-typedoc'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { noopTask } from '@essex/build-utils'
import * as gulp from 'gulp'
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
	const buildTypings = emitTypings(stripInternalTypes)
	const compileTS = compileTypescript()
	const compileJS = buildBabel(env)

	return gulp.parallel(
		generateDocs,
		buildTypings,
		//
		// The primary transpilation pipeline
		//  tsc -> babel -> bundlers
		//
		gulp.series(compileTS, compileJS),
	)
}
