/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import { getNodeModulesPaths } from '@essex/build-util-hoister'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import * as webpack from 'webpack'
import {
	getWdsStaticConfig,
	getHomePage,
	getTitle,
	getIndexFile,
	getBabelConfiguration,
} from './configValues'
import { log } from './log'
import { validateConfiguration } from './validate'
/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PnpWebpackPlugin = require('pnp-webpack-plugin')

// Webpack Loaders
const babelLoader = require.resolve('babel-loader')
const cacheLoader = require.resolve('cache-loader')
const cssLoader = require.resolve('css-loader')
const sassLoader = require.resolve('sass-loader')
const styleLoader = require.resolve('style-loader')
const tsLoader = require.resolve('ts-loader')

export interface Configuration {
	env?: string
	mode?: 'development' | 'production'
	pnp?: boolean
	typecheck?: boolean
	// extends
	aliases?: (env: string, mode: string) => any
	output?: (env: string, mode: string) => any
	devServer?: (env: string, mode: string) => any
	environment?: (env: string, mode: string) => any
	plugins?: (env: string, mode: string) => any[]
	modules?: (env: string, mode: string) => string[]
	loaderModules?: (env: string, mode: string) => string[]
	htmlWebpackPlugin?: (env: string, mode: string) => any
}
export function configure({
	env = 'development',
	mode = 'development',
	pnp = false,
	typecheck = true,
	aliases,
	output,
	devServer,
	environment,
	plugins,
	modules,
	loaderModules,
	htmlWebpackPlugin,
}: Configuration): webpack.Configuration {
	validateConfiguration()
	const isDevelopment = mode !== 'production'
	const extendedAliases = aliases ? aliases(env, mode) : {}
	const extendedOutput = output ? output(env, mode) : {}
	const extendedDevServer = devServer ? devServer(env, mode) : {}
	const extendedEnv = environment ? environment(env, mode) : {}
	const extendedPlugins = plugins ? plugins(env, mode) : []
	const extendedResolveModules = modules ? modules(env, mode) : []
	const extendedResolveLoaderModules = loaderModules
		? loaderModules(env, mode)
		: []
	const extendedHtmlWebpackPlugin = htmlWebpackPlugin
		? htmlWebpackPlugin(env, mode)
		: {}

	if (aliases) {
		log('extend resolve', aliases)
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

	const result: webpack.Configuration & { devServer: any } = {
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
							options: getBabelConfiguration(env),
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
			pnp ? PnpWebpackPlugin.moduleLoader(module) : undefined,
			typecheck ? new ForkTsCheckerWebpackPlugin() : undefined,
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
		].filter(p => !!p),
		node: {
			fs: 'empty',
		},
	}

	log('final webpack configuration', result)
	return result
}
