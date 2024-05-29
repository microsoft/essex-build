/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { ResolvePluginInstance } from 'webpack'

export function getResolvePlugins(
	useTsConfigPaths: boolean,
): ResolvePluginInstance[] {
	const result: ResolvePluginInstance[] = []

	// Allows us to resolve paths defined with tsconfig.paths
	if (useTsConfigPaths) {
		result.push(new TsConfigPathsPlugin())
	}

	return result
}
