/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Configuration } from 'webpack-dev-server'

const DEFAULT_WDS_CONFIG: Configuration = {
	hot: true,
	compress: true,
	historyApiFallback: true,
	client: {
		logging: 'error',
	},
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
		'Access-Control-Allow-Headers':
			'X-Requested-With, content-type, Authorization',
	},
}
export function getWdsConfig(extend: Partial<Configuration>): Configuration {
	return {
		...DEFAULT_WDS_CONFIG,
		...getStaticConfig(),
		...extend,
	}
}

/**
 * Gets the static assets configuration for webpack dev server.
 * If <package>/assets directory is present, it will be used
 * to serve static assets out of.
 */
function getStaticConfig(): Configuration {
	const staticFolder = join(process.cwd(), 'public')
	return existsSync(staticFolder)
		? {
				static: {
					directory: staticFolder,
					watch: true,
				},
			}
		: {}
}
