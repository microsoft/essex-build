/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import type { Command } from 'commander'
import { generateTypedocs } from '../steps/typedoc'
import { compile as compileTypescript } from '../steps/typescript'

export interface BuildCommandOptions {
	/**
	 * Emits TypeDoc documentation generation
	 */
	docs?: boolean

	/**
	 * Strips internal types in documentation
	 */
	stripInternalTypes?: boolean
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
		.action(async (options: BuildCommandOptions): Promise<any> => {
			await executeBuild(options)
		})
}

export function executeBuild({
	docs = false,
	stripInternalTypes = false,
}: BuildCommandOptions): Promise<void> {
	const cwd = process.cwd()
	const tsConfigPath = join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	const transpileSource = compileTypescript(stripInternalTypes)
	return docs
		? Promise.all([generateTypedocs(), transpileSource]).then(() => {
				/* nothing */
		  })
		: transpileSource
}
