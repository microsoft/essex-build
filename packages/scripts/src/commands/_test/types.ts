/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface TestCommandOptions {
	verbose?: boolean
	coverage?: boolean
	watch?: boolean
	ci?: boolean
	clearCache?: boolean
	updateSnapshots?: boolean
	coverageThreshold?: string
	browser?: boolean
	configFile?: string
}
