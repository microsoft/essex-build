import { EnvironmentPlugin, WebpackPluginInstance } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import type { ConfigurationManager } from '../inputConfig'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

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
