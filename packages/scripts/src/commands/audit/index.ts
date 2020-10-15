/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { configureTasks } from './tasks'
import { execGulpTask } from '@essex/build-utils'
import { success, fail } from '@essex/tasklogger'

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
			return Promise.resolve()
				.then(() => configureTasks())
				.then(build => execGulpTask(build))
				.then(() => success('audit'))
				.catch(err => {
					console.log('error in audit', err)
					fail('audit')
					process.exitCode = 1
				})
		})
}
