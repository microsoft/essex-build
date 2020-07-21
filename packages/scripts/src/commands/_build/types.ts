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

	env?: string
}
