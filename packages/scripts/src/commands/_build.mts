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

export async function executeBuild({
	docs = false,
	stripInternalTypes = false,
}: BuildCommandOptions): Promise<void> {
	const cwd = process.cwd()
	const tsConfigPath = path.join(cwd, 'tsconfig.json')
	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}
	const generateDocs = docs ? generateTypedocs() : noop()
	await compileTypescript(stripInternalTypes)
	// await copyAssets()
	await processEsm('dist/esm')
	await verifyExports()
	await generateDocs
}

// async function copyAssets() {
// 	const files = await new Promise<string[]>((resolve, reject) => {
// 		glob(
// 			'src/**/*.json',
// 			{
// 				cwd: process.cwd(),
// 			},
// 			(err, res) => {
// 				if (err) {
// 					reject(err)
// 				} else {
// 					resolve(res)
// 				}
// 			},
// 		)
// 	})

// 	for (const file of files) {
// 		console.log('processing %s', file)
// 		const esmPath = file.replace('src/', 'dist/esm/')
// 		const cjsPath = file.replace('src/', 'dist/cjs/')
// 		console.log("%s -> '%s'", file, esmPath)
// 		console.log("%s -> '%s'", file, cjsPath)

// 		await Promise.all([
// 			mkdir(path.dirname(esmPath), { recursive: true }),
// 			mkdir(path.dirname(cjsPath), { recursive: true }),
// 		])
// 		console.log("copying files")
// 		await Promise.all([copyFile(file, esmPath), copyFile(file, cjsPath)])
// 	}
// }
