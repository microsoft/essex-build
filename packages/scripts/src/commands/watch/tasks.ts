/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { watchBabel } from '@essex/build-step-babel'
import { watchTypescript } from '@essex/build-step-typescript'
import { TaskFunction } from 'gulp'
import { WatchCommandOptions } from './types'

export function configureTasks({
	env = 'development',
}: WatchCommandOptions): TaskFunction {
	return () => {
		watchTypescript()
		watchBabel(env)
	}
}
