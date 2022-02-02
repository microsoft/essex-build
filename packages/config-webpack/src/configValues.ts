/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { Configuration } from 'webpack-dev-server'
import { log } from './log'

const DEFAULT_SWC_CONFIG = {
	sourceMaps: true,
	env: {
		coreJs: '3',
		targets: {
			node: 14,
			browsers: ['>0.5%', 'not IE 11', 'not dead'],
		},
		mode: 'usage',
	},
	jsc: {
		parser: {
			syntax: 'typescript',
			tsx: true,
			decorators: true,
			dynamicImport: true,
		},
		transform: {
			react: { runtime: 'automatic', useBuiltins: true },
		},
	},
}

/* eslint-disable @typescript-eslint/no-var-requires */
export const pkgJson = require(join(process.cwd(), 'package.json'))

/**
 * Gets the static assets configuration for webpack dev server.
 * If <package>/assets directory is present, it will be used
 * to serve static assets out of.
 */
export function getWdsStaticConfig(): Configuration {
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

export function getHomePage(): string | boolean {
	return pkgJson.homepage ? pkgJson.homepage : false
}

export function getTitle(): string {
	return pkgJson.title || pkgJson.name || 'Essex Application'
}

export function getIndexFile(): string {
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

export function getSwcOptions() {
	if (existsSync(join(process.cwd(), '.swcrc'))) {
		const swcrc = readFileSync(join(process.cwd(), '.swcrc'), 'utf8')
		return JSON.parse(swcrc)
	} else {
		return DEFAULT_SWC_CONFIG
	}
}
