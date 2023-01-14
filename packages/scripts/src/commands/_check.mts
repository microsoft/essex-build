/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { eslint } from '../steps/eslint/index.mjs'
import { runFormatter } from '../steps/runFormatter.js'
import type { Formatter } from '../types.mjs'

export interface CheckCommandOptions {
	verbose?: boolean | undefined
	strict?: boolean
	formatter?: Formatter
}

const DEFAULT_FILESET = ['.']

const restricted: Record<string, boolean> = {
	'--strict': true,
	'--formatter': true,
	'--verbose': true,
}
export default function check(program: Command): void {
	program
		.command('check [...files]')
		.description('performs static analysis checks')
		.option('-v, --verbose', 'verbose output')
		.option('--strict', 'strict linting, warnings will cause failure')
		.option(
			'--formatter [formatter]',
			'the formatter to use ("prettier" or "none")',
		)
		.action(async (files: string[], options: CheckCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter((t) => !restricted[t])]
			await executeCheck(options, files)
		})
}

export async function executeCheck(
	opts: CheckCommandOptions & { fix?: boolean },
	files: string[] | undefined,
): Promise<void> {
	files = files ?? DEFAULT_FILESET
	const lint = eslint(opts.fix, opts.strict, files)
	const format = runFormatter(opts)

	await Promise.all([lint, format])
}
