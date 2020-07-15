/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BundleMode } from '../build/types'

export interface WatchCommandOptions {
	verbose?: boolean
	env?: string
	mode?: BundleMode
}
