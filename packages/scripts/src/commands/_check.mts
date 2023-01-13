/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { eslint } from '../steps/eslint/index.mjs'
import { runFormatter } from '../steps/runFormatter.js'
import { Formatter } from '../types.mjs'

export interface CheckCommandOptions {
	verbose?: boolean | undefined
	strict?: boolean
	formatter?: Formatter
}

const DEFAULT_FILESET = ['.']

const restricted: Record<string, boolean> = {
	'--strict': true,
	'--formatter': true,
}
export default function check(program: Command): void {
	program
		.command('check [...files]')
		.description('performs static analysis checks')
		.option('-v, --verbose', 'verbose output')
		.option('--strict', 'strict linting, warnings will cause failure')
		.option('--formatter [formatter]', 'the formatter to use ("prettier", "rome", or "none")')
		.action(async (files: string[], options: CheckCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter((t) => !restricted[t])]
			await executeCheck(options, files)
		})
}

export async function executeCheck(
	{
		fix = false,
		strict = false,
		verbose = false,
		formatter = Formatter.Prettier,
	}: CheckCommandOptions & {fix?: boolean},
	files: string[] | undefined,
): Promise<void> {
	files = files ?? DEFAULT_FILESET
	const lint = eslint(fix, strict, files)
	const format = runFormatter(formatter, fix, verbose)

	await Promise.all([lint, format])
}