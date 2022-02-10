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
	skipEsmChecks?: boolean
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
		.option('--skipEsmChecks', 'opt-out of ESM processing and verification')
		.action(async (options: BuildCommandOptions): Promise<any> => {
			await executeBuild(options)
		})
}

export async function executeBuild({
	docs = false,
	stripInternalTypes = false,
	skipEsmChecks = false,
}: BuildCommandOptions): Promise<void> {
	const cwd = process.cwd()
	const tsConfigPath = path.join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}
	const generateDocs = docs ? generateTypedocs() : noop()
	await compileTypescript(stripInternalTypes)
	if (!skipEsmChecks) {
		await processEsm('dist/esm')
		await verifyPackage()
		await verifyExports()
	}
	await generateDocs
}
