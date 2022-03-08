/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Options as HtmlPluginConfig } from 'html-webpack-plugin'
import type {
	Configuration as WebpackConfig,
	WebpackPluginInstance,
} from 'webpack'
import type { Configuration as WdsConfig } from 'webpack-dev-server'

import type { Configuration } from '../types.js'
import { getHomePage } from './getHomePage.js'
import { getIndexFile } from './getIndexFile.js'
import { getTitle } from './getTitle.js'
import { isTsConfigPathsConfigured } from './isTsConfigPathsConfigured.js'
import { validate } from './validate.js'

export class ConfigurationManager {
	public constructor(private _config: Configuration) {
		validate()
	}

	public get mode(): string {
		return this._config.mode || 'none'
	}

	public get env(): string {
		return this._config.env || 'development'
	}

	public get typecheck(): boolean {
		return this._config.typecheck ?? true
	}

	public get isDevelopment(): boolean {
		return this.mode !== 'production'
	}

	public get useTsConfigPaths(): boolean {
		return isTsConfigPathsConfigured()
	}

	public get extendedAlias(): NonNullable<WebpackConfig['resolve']>['alias'] {
		return this._config.aliases ? this._config.aliases(this.env, this.mode) : {}
	}

	public get extendedOutput(): WebpackConfig['output'] {
		return this._config.output ? this._config.output(this.env, this.mode) : {}
	}

	public get extendedDevServer(): Partial<WdsConfig> {
		return this._config.devServer
			? this._config.devServer(this.env, this.mode)
			: {}
	}

	public get extendedEnvironment(): Record<string, any> {
		return this._config.environment
			? this._config.environment(this.env, this.mode)
			: {}
	}

	public get extendedPlugins(): WebpackPluginInstance[] {
		return this._config.plugins ? this._config.plugins(this.env, this.mode) : []
	}

	public get extendedResolveModules(): string[] {
		return this._config.modules ? this._config.modules(this.env, this.mode) : []
	}

	public get extendedResolveLoaderModules(): string[] {
		return this._config.loaderModules
			? this._config.loaderModules(this.env, this.mode)
			: []
	}

	public get extendedHtmlWebpackPlugin(): HtmlPluginConfig {
		return this._config.htmlWebpackPlugin
			? this._config.htmlWebpackPlugin(this.env, this.mode)
			: {}
	}

	public get indexFile(): string {
		return getIndexFile()
	}

	public get title(): string {
		return getTitle()
	}
	public get homepage(): string | boolean {
		return getHomePage()
	}
}
