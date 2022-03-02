/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Options as HtmlPluginConfig } from 'html-webpack-plugin'
import type {
	Configuration as WebpackConfig,
	WebpackPluginInstance,
} from 'webpack'
import type { Configuration as WdsConfig } from 'webpack-dev-server'
export interface Configuration {
	env?: string
	mode?: 'development' | 'production' | 'none'
	typecheck?: boolean
	useTsConfigPaths?: boolean

	// extends
	aliases?: (
		env: string,
		mode: string,
	) => NonNullable<WebpackConfig['resolve']>['alias']
	output?: (env: string, mode: string) => WebpackConfig['output']
	devServer?: (env: string, mode: string) => Partial<WdsConfig>
	environment?: (env: string, mode: string) => any
	plugins?: (env: string, mode: string) => WebpackPluginInstance[]
	modules?: (env: string, mode: string) => string[]
	loaderModules?: (env: string, mode: string) => string[]
	htmlWebpackPlugin?: (env: string, mode: string) => Partial<HtmlPluginConfig>
}
