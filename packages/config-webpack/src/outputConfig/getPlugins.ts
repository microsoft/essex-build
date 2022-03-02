/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { EnvironmentPlugin, WebpackPluginInstance } from 'webpack'
import type { ConfigurationManager } from '../inputConfig'

export function getPlugins({
	isDevelopment,
	typecheck,
	env,
	extendedEnvironment,
	extendedHtmlWebpackPlugin,
	extendedPlugins,
	title,
	homepage,
}: ConfigurationManager): WebpackPluginInstance[] {
	const result: WebpackPluginInstance[] = [
		new HtmlWebpackPlugin({
			title,
			base: isDevelopment ? false : homepage,
			...extendedHtmlWebpackPlugin,
		}),
		new EnvironmentPlugin({
			NODE_ENV: env,
			...extendedEnvironment,
		}),
		new MiniCssExtractPlugin({
			filename: isDevelopment ? '[name].css' : '[name].[fullhash].css',
			chunkFilename: isDevelopment ? '[id].css' : '[id].[fullhash].css',
		}),
	]

	if (typecheck) {
		result.push(
			new ForkTsCheckerWebpackPlugin({
				async: true,
				typescript: {
					mode: 'readonly',
				},
			}),
		)
	}

	result.push(...extendedPlugins)
	return result
}
