/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { eslint } from '../steps/eslint/index.mjs'
import { prettyQuick } from '../steps/pretty-quick/index.mjs'
import { noop } from '../util/noop.mjs'

interface LintCommandOptions {
	fix?: boolean
	docs?: boolean
	strict?: boolean
	noFormat?: boolean
}

const DEFAULT_FILESET = ['.']

const restricted: Record<string, boolean> = {
	'--fix': true,
	'--staged': true,
	'--strict': true,
	'--noFormat': true,
}
export default function lint(program: Command): void {
	program
		.command('lint [...files]')
		.description('performs static analysis checks')
		.option('--strict', 'strict linting, warnings will cause failure')
		.option('--fix', 'correct fixable problems')
		.option('--noFormat', 'do not run code formatting')
		.action(async (files: string[], options: LintCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter((t) => !restricted[t])]
			await execute(options, files)
		})
}

async function execute(
	{
		fix = false,
		strict = false,
		noFormat = false,
	}: LintCommandOptions,
	files: string[] | undefined,
): Promise<void> {
	files = files ?? DEFAULT_FILESET
	const checkCode = eslint(fix, strict, files)
	const checkFormatting = noFormat
		? noop()
		: prettyQuick({ check: !fix })

	await Promise.all([checkCode, checkFormatting])
}