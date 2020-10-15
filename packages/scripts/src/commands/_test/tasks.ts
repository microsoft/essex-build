/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as gulp from 'gulp'
import { TestCommandOptions } from './types'
import { jestGulp } from '@essex/build-step-jest'

export function configureTasks(config: TestCommandOptions): gulp.TaskFunction {
	return jestGulp(config)
}
