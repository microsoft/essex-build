/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type * as swc from '@swc/core'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { get, merge } from 'lodash'

const TARGET_PACKAGE_JSON_PATH = path.join(process.cwd(), './package.json')
const SWCRC_FILE = path.join(process.cwd(), '.swcrc')

const DEFAULT_SWC_CONFIG: swc.Config = {
	sourceMaps: true,
	jsc: {
		target: 'es2020',
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

export function getSwcOptions() {
	if (existsSync(SWCRC_FILE)) {
		const swcrc = readFileSync(SWCRC_FILE, 'utf8')
		const result = JSON.parse(swcrc)
		if (isDebug()) {
			console.log('using custom swc configuration', result)
		}
		return result
	} else {
		const pkg = readPackageJson(TARGET_PACKAGE_JSON_PATH)
		const swcOverrides = get(pkg, 'essex.swc')
		if (swcOverrides) {
			const merged = merge(DEFAULT_SWC_CONFIG, swcOverrides)
			if (isDebug()) {
				console.log(
					'applying essex.swc overrides to default swc configuration\n\n',
					merged,
				)
			}
			return merged
		} else {
			if (isDebug()) {
				console.log('using default swc configuration')
			}
			return DEFAULT_SWC_CONFIG
		}
	}
}
function isDebug() {
	return Boolean(process.env['ESSEX_DEBUG'])
}
function readPackageJson(pkgPath: string) {
	const data = readFileSync(pkgPath, 'utf-8')
	return JSON.parse(data)
}
