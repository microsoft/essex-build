/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import { CheckCommandOptions, executeCheck } from './_check.mjs'


const restricted: Record<string, boolean> = {
	'--fix': true,
	'--strict': true,
	'--formatter': true,
}
export default function fix(program: Command): void {
	program
		.command('fix [...files]')
		.description('performs static analysis checks')
		.option('--strict', 'strict linting, warnings will cause failure')
		.option('--formatter [formatter]', 'the formatter to use ("prettier", "rome", or "none")')
		.action(async (files: string[], options: CheckCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter((t) => !restricted[t])]
			await executeCheck({...options, fix: true}, files)
		})
}
