/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface BundleCommandOptions {
	verbose?: boolean
	/**
	 * Emits a bundle using webpack.
	 */
	webpack?: boolean
	/**
	 * Emits a bundle using Rollup.js. Rollup is required as a
	 * client-dependency for this option
	 */
	rollup?: boolean
	
	env?: string

	mode?: 'production' | 'development'
}
