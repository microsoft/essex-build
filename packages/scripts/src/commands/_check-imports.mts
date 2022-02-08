/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

export interface CheckImportsCommandOptions {
	esm?: boolean | undefined
	cjs?: boolean | undefined
}

export default function checkImports(program: Command): void {
	program
		.command('check-imports [api.json]')
		.description('verifies package imports')
		.option('--esm', 'check ESM imports')
		.option('--cjs', 'check cjs requires')
		.action(
			async (
				apiFile: string,
				options: CheckImportsCommandOptions,
			): Promise<any> => {
				await execute(apiFile, options)
			},
		)
}

export async function execute(
	apiFile: string,
	{ esm, cjs }: CheckImportsCommandOptions,
): Promise<void> {
	console.log('check imports', apiFile, esm, cjs)
}
