/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import type { Command } from 'commander'
import { generateTypedocs } from '../steps/typedoc'
import { compile as compileTypescript } from '../steps/typescript'
import { esmify as processEsm } from '../steps/esmify'
import { noop } from '../util/noop'

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
	 * Process dist/esm for esm compliance
	 */
	esmify?: boolean
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
		.option('--esmify', 'post-process ESM assets for ESM compatibility')
		.action(async (options: BuildCommandOptions): Promise<any> => {
			await executeBuild(options)
		})
}

export async function executeBuild({
	docs = false,
	stripInternalTypes = false,
	esmify = false,
}: BuildCommandOptions): Promise<void> {
	const cwd = process.cwd()
	const tsConfigPath = join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}
	const generateDocs = docs ? generateTypedocs() : noop()
	const transpile = compileTypescript(stripInternalTypes)

	await Promise.all([generateDocs, transpile])

	if (esmify) {
		await processEsm('dist/esm')
	}
}
