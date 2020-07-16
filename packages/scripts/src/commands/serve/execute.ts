/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { webpackServe } from '@essex/build-step-webpack'
import { resolveShellCode } from '@essex/build-utils'

export interface ServeCommandOptions {
	mode?: 'production' | 'development'
	env?: string
	verbose?: boolean
}

export async function execute({
	env,
	mode,
	verbose,
}: ServeCommandOptions): Promise<number> {
	return webpackServe({ env, mode, verbose }).then(...resolveShellCode())
}
