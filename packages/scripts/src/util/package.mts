/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const SCRIPTS_PACKAGE_JSON_PATH = path.join(
	__dirname,
	'../../package.json',
)
export const TARGET_PACKAGE_JSON_PATH = path.join(
	process.cwd(),
	'./package.json',
)

export interface PackageJsonData {
	name: string
	version: string
	/**
	 * for websites and docgen
	 */
	title?: string
	scripts?: {
		build?: string
		clean?: string
		start?: string
		[scriptKey: string]: string | undefined
	}
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	peerDependencies?: Record<string, string>
	exports?: {
		import?: string
		require?: string
		types?: string
		[exportskey: string]: string | undefined
	}
	type?: string
	main?: string
	module?: string
	types?: string
	publishConfig?: Partial<Omit<PackageJsonData, 'publishConfig'>>
	essex?: {
		exports?: Record<string, string>
	}
}

export async function readScriptsPackageJson(): Promise<PackageJsonData> {
	return readPackageJson(SCRIPTS_PACKAGE_JSON_PATH)
}

export async function readTargetPackageJson(): Promise<PackageJsonData> {
	return readPackageJson(TARGET_PACKAGE_JSON_PATH)
}

async function readPackageJson(pkgPath: string): Promise<PackageJsonData> {
	const data = await fs.readFile(pkgPath, 'utf-8')
	return JSON.parse(data) as PackageJsonData
}

export async function readPublishedPackageJson() {
	const pkg = await readTargetPackageJson()
	if (pkg.publishConfig) {
		return {
			...pkg,
			...pkg.publishConfig,
			publishConfig: undefined,
		}
	} else return pkg
}
