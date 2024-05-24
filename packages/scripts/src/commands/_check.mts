/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { eslint } from '../steps/eslint/index.mjs'

export interface CheckCommandOptions {
	verbose?: boolean | undefined
	strict?: boolean
}

const DEFAULT_FILESET = ['.']

const restricted: Record<string, boolean> = {
	'--strict': true,
	'--verbose': true,
}
// biome-ignore lint/style/noDefaultExport: this is a CLI command
export default function check(program: Command): void {
	program
		.command('check [...files]')
		.description('performs static analysis checks')
		.option('-v, --verbose', 'verbose output')
		.option('--strict', 'strict linting, warnings will cause failure')
		.action(async (files: string[], options: CheckCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter((t) => !restricted[t])]
			await executeCheck(options, files)
		})
}

export function executeCheck(
	opts: CheckCommandOptions & { fix?: boolean },
	files: string[] | undefined,
): Promise<void> {
	return eslint(opts.fix, opts.strict, files ?? DEFAULT_FILESET)
}
