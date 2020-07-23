/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { webpackServe } from '@essex/build-step-webpack'

export interface ServeCommandOptions {
	mode?: 'production' | 'development'
	env?: string
	verbose?: boolean
}

export async function execute({
	env = 'development',
	mode = 'development',
	verbose,
}: ServeCommandOptions): Promise<void> {
	return webpackServe({ env, mode, verbose })
}
