/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import path from 'path'
import type { Command } from 'commander'
import { generateTypedocs } from '../steps/typedoc/index.mjs'
import { compile as compileTypescript } from '../steps/typescript/index.mjs'
import { esmify as processEsm } from '../steps/esmify/index.mjs'
import { noop } from '../util/noop.mjs'
import { verifyExports } from '../steps/verifyExports/index.mjs'
import { verifyPackage } from '../steps/verifyPackage/index.mjs'
import { BuildMode } from '../types.mjs'

export interface BuildCommandOptions {
	/**
	 * Emits TypeDoc documentation generation
	 */
	docs?: boolean

	/**
	 * Strips internal types in documentation
	 */
	stripInternalTypes?: boolean

	/**
	 * Opt-out of ESM processing and verification
	 */
	skipChecks?: boolean

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
		.option(
			'--skipChecks',
			'skips package.json and esm/cjs verification checks',
		)
		.option('--mode [mode]', 'options are "legacy", "dual", and "esm"')
		.action(async (options: BuildCommandOptions): Promise<any> => {
			await executeBuild(options)
		})
}

export async function executeBuild({
	docs = false,
	stripInternalTypes = false,
	skipChecks = false,
	mode = BuildMode.esm,
}: BuildCommandOptions): Promise<void> {
	const performImportChecks = mode !== BuildMode.legacy && !skipChecks
	const cwd = process.cwd()
	const tsConfigPath = path.join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const generateDocs = docs ? generateTypedocs() : noop()
	await compileTypescript(stripInternalTypes, mode === BuildMode.esm)

	if (mode !== BuildMode.legacy) {
		await processEsm(
			mode === BuildMode.dual,
			mode === BuildMode.esm ? 'dist' : 'dist/esm',
		)
	}
	if (performImportChecks) await performChecks(mode)
	await generateDocs
}

async function performChecks(mode: BuildMode) {
	await verifyPackage(mode)
	await verifyExports(mode === BuildMode.esm)
}
