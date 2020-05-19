const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin')
const { join } = require('path')
const { existsSync } = require('fs')

function getBabelConfiguration() {
	const overrideFile = join(process.cwd(), 'babelrc.esm.js')
	const defaultFile = join(__dirname, '../babelrc.esm.js')

	if (existsSync(overrideFile)) {
		return require(overrideFile)
	} else {
		return require(defaultFile)
	}
}

function getMdxBabelConfiguration() {
	const config = getBabelConfiguration()
	const plugins = [
		...(config.plugins || []),
		require.resolve('@babel/plugin-transform-react-jsx'),
	]
	return {
		...config,
		plugins,
	}
}

const packageNodeModulesPath = join(process.cwd(), 'node_modules')
const scriptsNodeModulePath = join(__dirname, '../../node_modules')

module.exports = {
	stories: [
		join(process.cwd(), 'src/index.ts'),
		join(process.cwd(), '**/*.stories.(ts|tsx|js|jsx|mdx)'),
		join(process.cwd(), '**/*_stories.(ts|tsx|js|jsx|mdx)'),
	],
	addons: [
		require.resolve('@storybook/addon-actions/register'),
		require.resolve('@storybook/addon-links/register'),
		require.resolve('@storybook/addon-knobs/register'),
		require.resolve('@storybook/addon-a11y/register'),
		require.resolve('@storybook/addon-docs/register'),
	],
	webpackFinal: async config => {
		config.resolve.extensions.push('.ts', '.tsx')
		config.resolve.modules.push(packageNodeModulesPath, scriptsNodeModulePath)
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
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
				{
					loader: require.resolve('react-docgen-typescript-loader'),
				},
			],
		})
		config.module.rules.push({
			test: /\.(stories|story)\.mdx$/,
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: getMdxBabelConfiguration(),
				},
				{
					loader: require.resolve('@mdx-js/loader'),
					options: {
						compilers: [createCompiler({})],
					},
				},
			],
		})
		config.module.rules.push({
			test: /(\.|_)(stories|story)\.[tj]sx?$/,
			loader: require.resolve('@storybook/source-loader'),
			exclude: [/node_modules/],
			enforce: 'pre',
		})
		config.plugins.push(
			new ForkTsCheckerWebpackPlugin({
				checkSyntacticErrors: true,
				tsconfig: join(process.cwd(), 'tsconfig.json'),
				useTypescriptIncrementalApi: true,
			}),
		)
		return config
	},
}
