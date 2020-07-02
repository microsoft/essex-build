/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, LintCommandOptions } from './execute'

export default function lint(program: Command): void {
	program
		.command('lint')
		.description('performs static analysis checks')
		.option('-f, --fix', 'correct fixable problems')
		.option('--docs', 'performs documentation linting steps')
		.option('--staged', 'only do git-stage verifications')
		.option('--strict', 'strict linting, warnings will cause failure')
		.action(async (options: LintCommandOptions = {}) => {
			const code = await execute(options)
			process.exit(code)
		})
}
