/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'fs'
import path from 'path'
import ResolveTypescriptPlugin from 'resolve-typescript-plugin'
import type { Configuration as WebpackConfig } from 'webpack'

export interface EssexStorybookConfig {
	/**
	 * The stories globs. Default = [../../*\/src/**\/*.stories.@(mdx|js|jsx|ts|tsx)']
	 */
	stories?: string[]

	/**
	 * The static folders to serve
	 */
	staticDirs?: string[]

	/**
	 * A config hook for mutating the webpack configuration
	 * @param config - The webpack to use for stories
	 * @returns The updated webpack config
	 */
	webpackFinal?: (config: WebpackConfig) => WebpackConfig
}

const DEFAULT_SWC_CONFIG = {
	sourceMaps: true,
	jsc: {
		target: 'es2021',
		parser: {
			syntax: 'typescript',
			tsx: true,
			decorators: true,
			dynamicImport: true,
			importAssertions: true,
		},
		experimental: {
			keepImportAssertions: true,
		},
		transform: {
			react: { runtime: 'automatic', useBuiltins: true },
		},
	},
}

const SWCRC_FILE = path.join(process.cwd(), '.swcrc')
const SWC_CONFIG = fs.existsSync(path.join(process.cwd(), '.swcrc'))
	? JSON.parse(fs.readFileSync(SWCRC_FILE, { encoding: 'utf-8' }))
	: DEFAULT_SWC_CONFIG

const DEFAULT_STORIES = [
	/**
	 * search sibling packages by default
	 */
	'../../*/src/**/*.stories.@(mdx|js|jsx|ts|tsx)',
]
const DEFAULT_STATIC_DIRS: string[] = []

const identity = <T>(input: T) => input

export function configure({
	stories = DEFAULT_STORIES,
	staticDirs = DEFAULT_STATIC_DIRS,
	webpackFinal = identity,
}: EssexStorybookConfig) {
	return {
		stories,
		staticDirs,
		addons: [
			require.resolve('@storybook/addon-links'),
			'@storybook/addon-essentials',
			'@storybook/addon-interactions',
		],
		framework: {
			name: '@storybook/react-webpack5',
			options: {},
		},
		docs: {
			autodocs: true,
		},
		typescript: {
			reactDocgen: 'react-docgen-typescript',
			reactDocgenTypescriptOptions: {
				compilerOptions: {
					allowSyntheticDefaultImports: false,
					esModuleInterop: false,
				},
			},
		},
		webpackFinal(config: WebpackConfig) {
			if (config.resolve == null) {
				config.resolve = {}
			}
			config.resolve.plugins = [
				...(config.resolve.plugins ?? []),
				new ResolveTypescriptPlugin(),
			]
			config.resolve.alias = {
				...(config.resolve?.alias || {}),
				'@thematic/react': require.resolve('@thematic/react'),
				'@fluentui/react': require.resolve('@fluentui/react'),
				'styled-components': require.resolve('styled-components'),
			}

			// Swap out babel w/ swc for transpiling app-assets
			const rules = config.module?.rules
			if (rules == null) {
				throw new Error(
					'could not inject swc-loader into webpack config, no rules found',
				)
			}
			const babelRule = rules[2]
			if (babelRule == null) {
				throw new Error(
					'could not inject swc-loader into webpack config, no babel rule found',
				)
			}
			rules.splice(2, 1, {
				test: /\.(cjs|mjs|jsx?|cts|mts|tsx?)$/,
				loader: require.resolve('swc-loader'),
				options: SWC_CONFIG,
				include: (babelRule as any).include,
				exclude: (babelRule as any).exclude,
			})
			return webpackFinal(config)
		},
	}
}
