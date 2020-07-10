/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BundleMode } from '../build/types'
import { webpackServe } from '@essex/build-step-webpack'

export interface ServeCommandOptions {
	mode: BundleMode
	env: string
	verbose: boolean
}

export async function execute(config: ServeCommandOptions): Promise<number> {
	return webpackServe(config).then(() => 1)
}
