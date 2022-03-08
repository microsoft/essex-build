/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import chalk from 'chalk'
import chokidar from 'chokidar'
import type { Command } from 'commander'
import { existsSync } from 'fs'
import path from 'path'

import { esmify as processEsm } from '../steps/esmify/index.mjs'
import { compile as compileTypescript } from '../steps/typescript/index.mjs'
import { BuildMode } from '../types.mjs'

export interface WatchCommandOptions {
	/**
	 * Strips internal types from typings output
	 */
	stripInternalTypes?: boolean
	mode?: BuildMode
}

export default function build(program: Command): void {
	program
		.command('watch')
		.description('sets up build-watchers for a library package')
		.option(
			'--stripInternalTypes',
			'strip out internal types from typings declarations',
		)
		.option('--mode [mode]', 'options are "legacy", "dual", and "esm"')
		.action(async (options: WatchCommandOptions): Promise<any> => {
			await executeBuild(options)
		})
}

export async function executeBuild({
	stripInternalTypes = false,
	mode = BuildMode.esm,
}: WatchCommandOptions): Promise<void> {
	const rewriteEsmToMjs = mode === BuildMode.dual
	const esmOnly = mode === BuildMode.esm
	const cwd = process.cwd()
	const tsConfigPath = path.join(cwd, 'tsconfig.json')

	if (!existsSync(tsConfigPath)) {
		throw new Error('tsconfig.json must exist')
	}

	let initialAddsComplete = false

	chokidar.watch('./src').on('all', async (event, path) => {
		if (event !== 'add' && event !== 'addDir') {
			initialAddsComplete = true
		}
		if (initialAddsComplete) {
			console.log(chalk.yellow(`    [${event}] ${path}`))
			await compileTypescript(stripInternalTypes, esmOnly)
			if (mode !== BuildMode.legacy) {
				await processEsm(rewriteEsmToMjs, esmOnly ? 'dist' : 'dist/esm')
			}
		}
	})
}
