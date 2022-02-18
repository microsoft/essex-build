/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import type * as swc from '@swc/core'
import get from 'lodash/get.js'
import merge from 'lodash/merge.js'

const SWCRC_FILE = path.join(process.cwd(), '.swcrc')

export function getSwcOptions(base?: Partial<swc.Config>): swc.Config {
	if (existsSync(SWCRC_FILE)) {
		return readCustomSwcrc()
	} else {
		const defaultSwcOptions = determineDefaultSwcOptions(base)
		const swcOverrides = readSwcOverrides()
		if (isDebug()) {
			console.log(
				swcOverrides != null
					? 'applying essex.swc overrides'
					: 'using default swc configuration',
			)
		}
		return swcOverrides != null
			? merge(defaultSwcOptions, swcOverrides)
			: defaultSwcOptions
	}
}

function isDebug() {
	return Boolean(process.env['ESSEX_DEBUG'])
}

function readPackageJson(pkgPath: string) {
	const data = readFileSync(pkgPath, 'utf-8')
	return JSON.parse(data)
}

/**
 * A .swcrc files implies a total-override. Use this without any layering.
 * @returns
 */
function readCustomSwcrc(): swc.Options {
	const swcrc = readFileSync(SWCRC_FILE, 'utf8')
	const result = JSON.parse(swcrc)
	if (isDebug()) {
		console.log('using custom swc configuration')
	}
	return result
}

/**
 * package.json::essex.swc allows for partial-overriding of the default swc options used by the utility
 * @returns
 */
function readSwcOverrides(): Partial<swc.Options> {
	const pkgJsonPath = path.join(process.cwd(), './package.json')
	const pkg = readPackageJson(pkgJsonPath)
	return get(pkg, 'essex.swc')
}

/**
 * Determines the default SWC configuration. A utility may layer in its own defaults on top
 * of what's provided here
 * @param base The base swc config provided by the utiltiy
 * @returns The default SWC configuration to use
 */
function determineDefaultSwcOptions(
	base: Partial<swc.Config> | undefined,
): swc.Options {
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

	return base != null ? merge(DEFAULT_SWC_CONFIG, base) : DEFAULT_SWC_CONFIG
}
