/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { watchBabel } from '@essex/build-step-babel'
import { watchTypescript } from '@essex/build-step-typescript'
import * as gulp from 'gulp'
import { WatchCommandOptions } from './types'

export function configureTasks({ env = 'development' }: WatchCommandOptions) {
	return () => {
		watchTypescript()
		watchBabel(env)
	}
}
