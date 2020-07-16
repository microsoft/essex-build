/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { watchBabel } from '@essex/build-step-babel'
import { watchTypescript } from '@essex/build-step-typescript'
import { TaskFunction } from 'gulp'
import { WatchCommandOptions } from './types'
import { webpackWatch } from '@essex/build-step-webpack'
import { rollupWatch } from '@essex/build-step-rollup'

const webpackConfigFile = join(process.cwd(), 'webpack.config.js')

export function configureTasks({
	env = 'development',
}: WatchCommandOptions): TaskFunction {
	return () => {
		watchTypescript()
		watchBabel(env)
		rollupWatch()
		if (existsSync(webpackConfigFile)) {
			webpackWatch({ env })
		}
	}
}
