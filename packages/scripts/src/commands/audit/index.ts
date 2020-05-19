/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, AuditCommandOptions } from './execute'

export default function audit(program: Command): void {
	program
		.command('audit')
		.description(
			'audit dependencies for high-severity security vulnerabilities and licensing issues',
		)
		.action(async (options: AuditCommandOptions) => {
			const code = await execute(options)
			process.exit(code)
		})
}
