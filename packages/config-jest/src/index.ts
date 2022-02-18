/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { configure } from './configure.js'
import { getSetupFiles } from './overrides.js'
export * from './configure.js'
export * from './overrides.js'

export interface EssexJestOptions {
	esm?: boolean | undefined
}

/**
 * If a Jest config is present, use that - otherwise get the override
 */
export function getJestConfiguration(
	opts: Partial<EssexJestOptions> = {},
): any {
	const esm = opts.esm ?? false
	return configure(esm, getSetupFiles())
}
