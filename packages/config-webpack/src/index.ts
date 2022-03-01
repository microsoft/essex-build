/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { getSwcOptions } from '@essex/swc-opts'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import type { ResolvePluginInstance } from 'tsconfig-paths-webpack-plugin/lib/plugin.temp.types'
import webpack from 'webpack'
import type { Configuration as WdsConfiguration } from 'webpack-dev-server'
import {
	getWdsStaticConfig,
	getHomePage,
	getTitle,
	getIndexFile,
} from './configValues'
import { log } from './log'
import { validateConfiguration } from './validate'

/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ResolveTypescriptPlugin = require('resolve-typescript-plugin')

// Webpack Loaders
const cssLoader = require.resolve('css-loader')
const sassLoader = require.resolve('sass-loader')
const styleLoader = require.resolve('style-loader')
const swcLoader = require.resolve('swc-loader')

function tryToDetermineIfUsesTsconfigPaths(): boolean {
	const tsconfigJsonPath = join(process.cwd(), 'tsconfig.json')
	if (existsSync(tsconfigJsonPath)) {
		const tsconfig = require(tsconfigJsonPath)
		if (tsconfig?.compilerOptions?.paths) {
			return true
		}
	}
	return false
}

export interface Configuration {
	env?: string
	mode?: 'development' | 'production' | 'none'
	typecheck?: boolean
	useTsConfigPaths?: boolean

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
	mode = 'none',
	typecheck = true,
	useTsConfigPaths = tryToDetermineIfUsesTsconfigPaths(),
	aliases,
	output,
	devServer,
	environment,
	plugins,
	modules,
	loaderModules,
	htmlWebpackPlugin,
}: Configuration = {}): webpack.Configuration & {
	devServer: WdsConfiguration
} {
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

	if (aliases) log('extend resolve', aliases)
	if (extendedDevServer) log('extend devServer', extendedDevServer)
	if (extendedResolveModules)
		log('extend resolveModules', extendedResolveModules)
	if (extendedResolveLoaderModules)
		log('extend resolveLoaderModules', extendedResolveLoaderModules)

	const standardModulePaths = ['node_modules']

	const buildPath = join(process.cwd(), 'build/')

	const result: webpack.Configuration & { devServer: any } = {
		mode: isDevelopment ? 'development' : 'production',
		entry: getIndexFile(),
		devtool: 'cheap-module-source-map',
		output: {
			path: buildPath,
			chunkFilename: '[name].[chunkhash].js',
			filename: '[name].[fullhash].js',
			...extendedOutput,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			modules: [...standardModulePaths, ...extendedResolveModules],
			alias: {
				...extendedAliases,
			},
			plugins: [
				// Allows us to resolve paths defined with tsconfig.paths
				useTsConfigPaths ? new TsConfigPathsPlugin() : undefined,
				// Resolves TypeScript paths that use ".js" extensions. This will be removed
				// as the ES2020 moduleResolution strategies are baked into the core tooling
				new ResolveTypescriptPlugin(),
			].filter(t => !!t) as ResolvePluginInstance[],
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
					use: { loader: swcLoader, options: getSwcOptions() },
				},
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
			],
		},
		devServer: {
			hot: true,
			compress: true,
			historyApiFallback: true,
			client: {
				logging: 'error',
			},
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
			typecheck
				? new ForkTsCheckerWebpackPlugin({
						async: true,
						typescript: {
							mode: 'readonly',
						},
				  })
				: undefined,
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
				filename: isDevelopment ? '[name].css' : '[name].[fullhash].css',
				chunkFilename: isDevelopment ? '[id].css' : '[id].[fullhash].css',
			}),
			...extendedPlugins,
		].filter(p => !!p),
	}

	log('final webpack configuration', result)
	return result
}
