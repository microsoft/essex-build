/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jestGulp } from '@essex/build-step-jest'
import * as gulp from 'gulp'
import { TestCommandOptions } from './types'

export function configureTasks(config: TestCommandOptions) {
	return gulp.parallel(jestGulp(config))
}
