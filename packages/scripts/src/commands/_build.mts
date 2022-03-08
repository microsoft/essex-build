/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type { Command } from 'commander'
import { existsSync } from 'fs'
import path from 'path'

import { esmify as processEsm } from '../steps/esmify/index.mjs'
import { generateTypedocs } from '../steps/typedoc/index.mjs'
import { compile as compileTypescript } from '../steps/typescript/index.mjs'
import { verifyExports } from '../steps/verifyExports/index.mjs'
import { verifyPackage } from '../steps/verifyPackage/index.mjs'
import { BuildMode } from '../types.mjs'
import { noop } from '../util/noop.mjs'

export interface BuildCommandOptions {
	/**
	 * Emits TypeDoc documentation generation
	 */
	docs?: boolean

	/**
	 * Strips internal types from typings output
	 */
	stripInternalTypes?: boolean

	/**
	 * Opt-out of ESM processing and verification
	 */
	skipPackageCheck?: boolean
	skipExportCheck?: boolean

	mode?: BuildMode
}

export default function build(program: Command): void {
	program
		.command('build')
		.description('builds a library package')
		.option('-d, --docs', 'generates TypeDoc documentation')
		.option(
			'--stripInternalTypes',
			'strip out internal types from typings declarations',
		)
		.option('--skipPackageCheck', 'skips package.json verification check')
		.option('--skipExportCheck', 'skips esm/cjs export check')
		.option('--mode [mode]', 'options are "legacy", "dual", and "esm"')
		.action(async (options: BuildCommandOptions): Promise<any> => {
			await executeBuild(options)
		})
}

export async function executeBuild({
	docs = false,
	stripInternalTypes = false,
	skipExportCheck = false,
	skipPackageCheck = false,
	mode = BuildMode.esm,
}: BuildCommandOptions): Promise<void> {
	const checkPackage = !skipPackageCheck
	const checkExports = mode !== BuildMode.legacy && !skipExportCheck
	const rewriteEsmToMjs = mode === BuildMode.dual
	const esmOnly = mode === BuildMode.esm
	const cwd = process.cwd()
	const tsConfigPath = path.join(cwd, 'tsconfig.json')

	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const generateDocs = docs ? generateTypedocs() : noop()
	await compileTypescript(stripInternalTypes, esmOnly)

	if (mode !== BuildMode.legacy) {
		await processEsm(rewriteEsmToMjs, esmOnly ? 'dist' : 'dist/esm')
	}

	if (checkPackage) await verifyPackage(mode)
	if (checkExports) await verifyExports(esmOnly)

	await generateDocs
}
