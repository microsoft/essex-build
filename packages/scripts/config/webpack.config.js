/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const webpack = require('webpack')
const { join } = require('path')
const { existsSync } = require('fs')
const debug = require('debug')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkgJson = require(join(process.cwd(), 'package.json'))
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const log = debug('essex:webpack')

/**
 * Gets the static assets configuration for webpack dev server.
 * If <package>/assets directory is present, it will be used
 * to serve static assets out of.
 */
function getWdsStaticConfig() {
	const staticFolder = join(process.cwd(), 'public')
	return existsSync(staticFolder)
		? {
				contentBase: staticFolder,
				watchContentBase: true,
		  }
		: {}
}

/**
 * Validates the webpack configuration
 */
function validateConfiguration() {
	if (pkgJson.homepage && !pkgJson.homepage.endsWith('/')) {
		throw new Error(
			"package.json homepage setting should end with a '/' character for the base tag to function properly",
		)
	}
	// perform any additional validation here
}
validateConfiguration()

function getHomePage() {
	return pkgJson.homepage ? pkgJson.homepage : false
}

function getTitle() {
	return pkgJson.title || pkgJson.name || 'Essex Application'
}

function getIndexFile() {
	const indexTsx = join(process.cwd(), 'src', 'index.tsx')
	const indexTs = join(process.cwd(), 'src', 'index.ts')
	const indexJsx = join(process.cwd(), 'src', 'index.jsx')
	const indexJs = join(process.cwd(), 'src', 'index.js')

	if (existsSync(indexTsx)) {
		log('entry: index.tsx')
		return indexTsx
	} else if (existsSync(indexTs)) {
		log('entry: index.ts')
		return indexTs
	} else if (existsSync(indexJsx)) {
		log('entry: index.jsx')
		return indexJsx
	} else {
		log('entry: index.js')
		return indexJs
	}
}

function getBabelConfiguration() {
	const overrideFile = join(process.cwd(), 'babelrc.esm.js')
	const defaultFile = join(__dirname, 'babelrc.esm.js')

	if (existsSync(overrideFile)) {
		return require(overrideFile)
	} else {
		return require(defaultFile)
	}
}

module.exports = (env = 'development', { mode }) => {
	const isDevelopment = mode !== 'production'
	const webpackExtendFile = join(process.cwd(), 'webpack.extend.js')
	const isExtended = existsSync(webpackExtendFile)
	const extend = isExtended ? require(webpackExtendFile) : {}
	const extendAliases = extend.extendAliases
		? extend.extendAliases(env, mode)
		: {}
	const extendOutput = extend.extendOutput ? extend.extendOutput(env, mode) : {}
	const extendDevServer = extend.extendDevServer
		? extend.extendDevServer(env, mode)
		: {}
	const extendEnv = extend.extendEnvironment
		? extend.extendEnvironment(env, mode)
		: {}
	const extendPlugins = extend.extendPlugins
		? extend.extendPlugins(env, mode)
		: []
	const extendResolveModules = extend.extendResolveModules
		? extend.extendResolveModules(env, mode)
		: []
	const extendResolveLoaderModules = extend.extendResolveLoaderModules
		? extend.extendResolveLoaderModules(env, mode)
		: []
	const extendHtmlWebpackPlugin = extend.htmlWebpackPlugin
		? extend.htmlWebpackPlugin(env, mode)
		: {}

	log('generating webpack config, extendfile? %s', isExtended)

	if (extendAliases) {
		log('extend resolve', extendAliases)
	}
	if (extendDevServer) {
		log('extend devServer', extendDevServer)
	}
	if (extendResolveModules) {
		log('extend resolveModules', extendResolveModules)
	}
	if (extendResolveLoaderModules) {
		log('extend resolveLoaderModules', extendResolveLoaderModules)
	}

	const packageNodeModulesPath = join(process.cwd(), 'node_modules')
	const buildPath = join(process.cwd(), 'build/')
	const scriptsNodeModulePath = join(__dirname, '../node_modules')
	const standardModulePaths = [
		packageNodeModulesPath,
		scriptsNodeModulePath,
		'node_modules',
	]
	let result = {
		mode: isDevelopment ? 'development' : 'production',
		entry: getIndexFile(),
		devtool: 'cheap-module-source-map',
		output: {
			path: buildPath,
			chunkFilename: '[name].[hash].js',
			filename: '[name].[hash].js',
			...extendOutput,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			modules: [...standardModulePaths, ...extendResolveModules],
			alias: {
				...extendAliases,
			},
		},
		resolveLoader: {
			modules: [...standardModulePaths, ...extendResolveLoaderModules],
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
						{ loader: require.resolve('cache-loader') },
						{
							loader: require.resolve('babel-loader'),
							options: getBabelConfiguration(),
						},
						{
							loader: require.resolve('ts-loader'),
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
						isDevelopment
							? require.resolve('style-loader')
							: MiniCssExtractPlugin.loader,
						{
							loader: require.resolve('css-loader'),
							options: {
								modules: true,
								sourceMap: isDevelopment,
							},
						},
						{
							loader: require.resolve('sass-loader'),
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
						isDevelopment
							? require.resolve('style-loader')
							: MiniCssExtractPlugin.loader,
						require.resolve('css-loader'),
						{
							loader: require.resolve('sass-loader'),
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
						isDevelopment
							? require.resolve('style-loader')
							: MiniCssExtractPlugin.loader,
						require.resolve('css-loader'),
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
			...extendDevServer,
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin(),
			new HtmlWebpackPlugin({
				title: getTitle(),
				base: isDevelopment ? false : getHomePage(),
				...extendHtmlWebpackPlugin,
			}),
			new webpack.EnvironmentPlugin({
				NODE_ENV: env,
				...extendEnv,
			}),
			new MiniCssExtractPlugin({
				filename: isDevelopment ? '[name].css' : '[name].[hash].css',
				chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
			}),
			...extendPlugins,
		],
		node: {
			fs: 'empty',
		},
	}

	// Extension File for custom tweaking of this configration
	if (extend.extendConfiguration) {
		log('using webpack config extender function')
		result = extend.extendConfiguration(result, env, mode)
	}

	log('final webpack configuration', result)
	return result
}
