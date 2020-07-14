/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { execGulpTask, resolveShellCode } from '@essex/build-utils'
import { Command } from 'commander'
import { configureTasks } from './tasks'

export interface AuditCommandOptions {
	verbose: boolean
}

export default function audit(program: Command): void {
	program
		.command('audit')
		.description(
			'audit dependencies for high-severity security vulnerabilities and licensing issues',
		)
		.action(() => {
			Promise.resolve()
				.then(() => configureTasks())
				.then(build => execGulpTask(build))
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
