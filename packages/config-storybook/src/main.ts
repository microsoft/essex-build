/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ResolveTypescriptPlugin from 'resolve-typescript-plugin'
import type {
	Configuration as WebpackConfig,
	RuleSetRule,
	WebpackPluginInstance,
} from 'webpack'

export interface EssexStorybookConfig {
	stories?: string[]
	staticDirs?: string[]
	resolveAliases?: Record<string, string>
	transpileMatch: (string | RegExp)[]
}

const DEFAULT_STORIES = [
	/**
	 * search sibling packages by default
	 */
	'../../*/src/**/*.stories.@(mdx|js|jsx|ts|tsx)',
]
const DEFAULT_STATIC_DIRS: string[] = []

export function configure({
	stories = DEFAULT_STORIES,
	staticDirs = DEFAULT_STATIC_DIRS,
	resolveAliases = {},
	transpileMatch = [],
}: EssexStorybookConfig) {
	return {
		stories,
		staticDirs,
		addons: [
			'@storybook/addon-links',
			'@storybook/addon-essentials',
			'@storybook/addon-interactions',
		],
		framework: '@storybook/react',
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
			// mute build output
			if (process.env['CI'] || process.env['SB_QUIET']) {
				config.stats = 'errors-only'
				config.plugins = config.plugins?.filter(
					(plugin: WebpackPluginInstance) =>
						plugin.constructor.name !== 'ProgressPlugin',
				)
			}

			if (!config.resolve) {
				config.resolve = {}
			}

			config.resolve.alias = {
				...(config.resolve.alias ?? {}),
				'styled-components': require.resolve('styled-components'),
				hsluv: require.resolve('hsluv'),
				'@thematic/react': require.resolve('@thematic/react'),
				'@thematic/fluent': require.resolve('@thematic/fluent'),
				'@fluentui/react': require.resolve('@fluentui/react'),
				...resolveAliases,
			}

			// resolve files ending with .ts
			if (!config.resolve.plugins) {
				config.resolve.plugins = []
			}
			// Resolve extensions from TS code
			config.resolve.plugins.push(new ResolveTypescriptPlugin())

			// run transpiler over monorepo linked projects
			const firstRule = config.module?.rules?.[0] as RuleSetRule | undefined

			if (firstRule != null) {
				const transpileMatchRules: RuleSetRule[] = transpileMatch.map(
					(match) => {
						return {
							...firstRule,
							include: match,
							exclude: undefined,
						}
					},
				)
				const importMeta = {
					test: /\.js$/,
					loader: require.resolve('@open-wc/webpack-import-meta-loader'),
				}
				config.module!.rules!.push(...transpileMatchRules, importMeta)
				config.module!.rules!.push({
					test: /\.mjs$/,
					include: /node_modules/,
					type: 'javascript/auto',
				})
			} else {
				throw new Error('unexpected incoming webpack config')
			}

			return config
		},
	}
}
