/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { getDefaultConfiguration } from './getDefaultConfiguration'
import { getJestConfigOverride } from './overrides'

/**
 * If a Jest config is present, use that - otherwise get the override
 */
export function getJestConfiguration(): any {
	return getJestConfigOverride() || getDefaultConfiguration()
}
