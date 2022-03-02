import type { RuleSetRule } from 'webpack'

// Webpack Loaders
/* eslint-disable @typescript-eslint/no-var-requires */
const cssLoader = require.resolve('css-loader')
const sassLoader = require.resolve('sass-loader')
const styleLoader = require.resolve('style-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

export function getStyleRules(isDevelopment: boolean): RuleSetRule[] {
	return [
		/**
		 * Sass Modules
		 */
		{
			test: /\.module\.s(a|c)ss$/,
			use: [
				isDevelopment ? styleLoader : MiniCssExtractPlugin.loader,
				{
					loader: cssLoader,
					options: {
						modules: true,
						sourceMap: isDevelopment,
					},
				},
				{
					loader: sassLoader,
					options: {
						sourceMap: isDevelopment,
					},
				},
			],
		},
		/**
		 * Plain Sass
		 */
		{
			test: /\.s(a|c)ss$/,
			exclude: /\.module.(s(a|c)ss)$/,
			use: [
				isDevelopment ? styleLoader : MiniCssExtractPlugin.loader,
				cssLoader,
				{
					loader: sassLoader,
					options: {
						sourceMap: isDevelopment,
					},
				},
			],
		},
		/**
		 * CSS
		 */
		{
			test: /\.css$/,
			use: [
				isDevelopment ? styleLoader : MiniCssExtractPlugin.loader,
				cssLoader,
			],
		},
	]
}
