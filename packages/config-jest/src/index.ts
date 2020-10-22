/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { configure } from './configure'
import { getJestConfigOverride, getSetupFiles } from './overrides'
export * from './configure'
export * from './overrides'

/**
 * If a Jest config is present, use that - otherwise get the override
 */
export function getJestConfiguration(): any {
	return getJestConfigOverride() || configure(getSetupFiles())
}
