/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { execGulpTask, resolveShellCode } from '@essex/build-utils'
import { Command } from 'commander'
import { configureTasks } from './tasks'
import { LintCommandOptions } from './types'

export default function lint(program: Command): void {
	program
		.command('lint')
		.description('performs static analysis checks')
		.option('-f, --fix', 'correct fixable problems')
		.option('--docs', 'performs documentation linting steps')
		.option('--staged', 'only do git-stage verifications')
		.option('--strict', 'strict linting, warnings will cause failure')
		.action((options: LintCommandOptions = {}) => {
			Promise.resolve(true)
				.then(() => configureTasks(options))
				.then(lint => execGulpTask(lint))
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
