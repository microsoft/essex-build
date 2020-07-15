/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { watchBabel } from '@essex/build-step-babel'
import { watchTypescript } from '@essex/build-step-typescript'
import { WatchCommandOptions } from './types'

export function configureTasks({
	verbose = false,
	env = 'development',
}: WatchCommandOptions) {
	return () => {
		watchTypescript(verbose)
		watchBabel(verbose, env)
	}
}
