/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	getWdsStaticConfig,
	getHomePage,
	getTitle,
	getIndexFile,
	getBabelConfiguration,
} from './configValues'
import { validateConfiguration } from './validate'
import { log } from './log'
import { getNodeModulesPaths } from './getNodeModulesPaths'
const { join } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const cacheLoader = require('cache-loader')
const babelLoader = require('babel-loader')
const tsLoader = require('ts-loader')
const styleLoader = require('style-loader')
const cssLoader = require('css-loader')
const sassLoader = require('sass-loader')

export interface Configuration {
	env?: string
	mode?: 'development' | 'production'
	extendAliases?: (env: string, mode: string) => any
	extendOutput?: (env: string, mode: string) => any
	extendDevServer?: (env: string, mode: string) => any
	extendEnvironment?: (env: string, mode: string) => any
	extendPlugins?: (env: string, mode: string) => any
	extendResolveModules?: (env: string, mode: string) => any
	extendResolveLoaderModules?: (env: string, mode: string) => any
	extendHtmlWebpackPlugin?: (env: string, mode: string) => any
}
export function configure({
	env = 'development',
	mode = 'development',
	extendAliases,
	extendOutput,
	extendDevServer,
	extendEnvironment,
	extendPlugins,
	extendResolveModules,
	extendResolveLoaderModules,
	extendHtmlWebpackPlugin,
}: Configuration) {
	validateConfiguration()
	const isDevelopment = mode !== 'production'
	const extendedAliases = extendAliases ? extendAliases(env, mode) : {}
	const extendedOutput = extendOutput ? extendOutput(env, mode) : {}
	const extendedDevServer = extendDevServer ? extendDevServer(env, mode) : {}
	const extendedEnv = extendEnvironment ? extendEnvironment(env, mode) : {}
	const extendedPlugins = extendPlugins ? extendPlugins(env, mode) : []
	const extendedResolveModules = extendResolveModules
		? extendResolveModules(env, mode)
		: []
	const extendedResolveLoaderModules = extendResolveLoaderModules
		? extendResolveLoaderModules(env, mode)
		: []
	const extendedHtmlWebpackPlugin = extendHtmlWebpackPlugin
		? extendHtmlWebpackPlugin(env, mode)
		: {}

	if (extendAliases) {
		log('extend resolve', extendAliases)
	}
	if (extendedDevServer) {
		log('extend devServer', extendedDevServer)
	}
	if (extendedResolveModules) {
		log('extend resolveModules', extendedResolveModules)
	}
	if (extendedResolveLoaderModules) {
		log('extend resolveLoaderModules', extendedResolveLoaderModules)
	}

	const standardModulePaths = [
		// client & workspaces paths
		...getNodeModulesPaths(),
		// config package node modules
		join(__dirname, '../node_modules'),
		'node_modules',
	]

	const buildPath = join(process.cwd(), 'build/')

	let result = {
		mode: isDevelopment ? 'development' : 'production',
		entry: getIndexFile(),
		devtool: 'cheap-module-source-map',
		output: {
			path: buildPath,
			chunkFilename: '[name].[hash].js',
			filename: '[name].[hash].js',
			...extendedOutput,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			modules: [...standardModulePaths, ...extendedResolveModules],
			alias: {
				...extendedAliases,
			},
		},
		resolveLoader: {
			modules: [...standardModulePaths, ...extendedResolveLoaderModules],
		},
		module: {
			rules: [
				/**
				 * TypeScript files
				 */
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						{ loader: cacheLoader },
						{
							loader: babelLoader,
							options: getBabelConfiguration(),
						},
						{
							loader: tsLoader,
							options: {
								configFile: join(process.cwd(), 'tsconfig.json'),
								transpileOnly: true,
							},
						},
					],
				},
				/**
				 * Sass Modules
				 */
				{
					test: /\.module\.s(a|c)ss$/,
					loader: [
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
					loader: [
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
					loader: [
						isDevelopment ? styleLoader : MiniCssExtractPlugin.loader,
						cssLoader,
					],
				},
			],
		},
		devServer: {
			stats: 'minimal',
			hot: true,
			open: true,
			compress: true,
			historyApiFallback: true,
			clientLogLevel: 'error',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods':
					'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers':
					'X-Requested-With, content-type, Authorization',
			},
			...getWdsStaticConfig(),
			...extendedDevServer,
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin(),
			new HtmlWebpackPlugin({
				title: getTitle(),
				base: isDevelopment ? false : getHomePage(),
				...extendedHtmlWebpackPlugin,
			}),
			new webpack.EnvironmentPlugin({
				NODE_ENV: env,
				...extendedEnv,
			}),
			new MiniCssExtractPlugin({
				filename: isDevelopment ? '[name].css' : '[name].[hash].css',
				chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
			}),
			...extendedPlugins,
		],
		node: {
			fs: 'empty',
		},
	}

	log('final webpack configuration', result)
	return result
}
