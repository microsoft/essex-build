/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface BuildCommandOptions {
	verbose?: boolean
	/**
	 * Emits TypeDoc documentation generation
	 */
	docs?: boolean
	/**
	 * Emits code, true by default unless --webpack or --rollup is set.
	 */
	code?: boolean
	/**
	 * Emits a bundle using webpack.
	 */
	webpack?: boolean
	/**
	 * Emits a bundle using Rollup.js. Rollup is required as a
	 * client-dependency for this option
	 */
	rollup?: boolean
	/**
	 * Builds a static storybook site
	 */
	storybook?: boolean

	env?: string
	mode?: BundleMode
}

export enum BundleMode {
	production = 'production',
	development = 'development',
	none = 'none',
}
