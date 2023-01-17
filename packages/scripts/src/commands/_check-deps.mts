/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import { checkDeps } from '../steps/checkDeps.js'

export interface CheckDepsCommandOptions {
	ignore?: string
}
export default function checkDepsCommand(program: Command): void {
	program
		.command('check-deps')
		.option(
			'--ignore [comma-separated list]',
			'libraries to ignore in the report',
		)
		.description('check for unused dependencies')
		.action(async ({ignore}: CheckDepsCommandOptions) => {
			await checkDeps({
				ignore: ignore != null ? ignore.split(',') : undefined
			})
		})
}
