/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface BaseWebpackConfig {
	env?: string
	mode?: string
	verbose?: boolean
}

export function getWebpackArgs(
	configPath: string,
	{ env, mode, verbose }: BaseWebpackConfig,
): string[] {
	const result = ['--config', configPath]
	if (env) {
		result.push('--env', env)
	}
	if (mode) {
		result.push('--mode', mode)
	}
	if (verbose) {
		result.push('--verbose')
	}

	return result
}
