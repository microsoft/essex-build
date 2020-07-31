/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { storybookStart } from '@essex/build-step-storybook'
import { webpackServe } from '@essex/build-step-webpack'

export interface ServeCommandOptions {
	mode?: 'production' | 'development'
	env?: string
	verbose?: boolean
	storybook?: boolean
}

export async function execute({
	env = 'development',
	mode = 'development',
	verbose = false,
	storybook,
}: ServeCommandOptions): Promise<void> {
	if (storybook) {
		return storybookStart(verbose)
	} else {
		return webpackServe({ env, mode, verbose })
	}
}
