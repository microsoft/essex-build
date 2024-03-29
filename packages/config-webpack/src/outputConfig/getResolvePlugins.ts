/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { ResolvePluginInstance } from 'webpack'

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment */
const ResolveTypescriptPlugin = require('resolve-typescript-plugin')

export function getResolvePlugins(
	useTsConfigPaths: boolean,
): ResolvePluginInstance[] {
	const result: ResolvePluginInstance[] = []

	// Allows us to resolve paths defined with tsconfig.paths
	if (useTsConfigPaths) {
		result.push(new TsConfigPathsPlugin())
	}

	// Resolves TypeScript paths that use ".js" extensions. This will be removed
	// as the ES2020 moduleResolution strategies are baked into the core tooling
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
	result.push(new ResolveTypescriptPlugin())
	return result
}
