/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { eslint } from '../steps/eslint'
import { prettyQuick } from '../steps/pretty-quick'

interface LintCommandOptions {
	fix?: boolean
	staged?: boolean
	docs?: boolean
	strict?: boolean
	docsOnly?: boolean
}

const restricted: Record<string, boolean> = {
	'--fix': true,
	'--staged': true,
	'--strict': true,
}
export default function lint(program: Command): void {
	program
		.command('lint [...files]')
		.description('performs static analysis checks')
		.option('--strict', 'strict linting, warnings will cause failure')
		.option('--fix', 'correct fixable problems')
		.option('--staged', 'only do git-stage verifications')
		.action(async (files: string[], options: LintCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter(t => !restricted[t])]
			await execute(options, files)
		})
}

function execute(
	{ fix = false, staged = false, strict = false }: LintCommandOptions,
	files: string[] | undefined,
): Promise<void> {
	const checkCode = eslint(fix, strict, files || ['.'])
	const checkFormatting = staged
		? prettyQuick({ staged: true })
		: prettyQuick({ check: !fix })

	return Promise.all([checkCode, checkFormatting]).then(() => {})
}
