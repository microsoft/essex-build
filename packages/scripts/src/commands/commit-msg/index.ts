/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { checkCommitMessage } from '@essex/build-step-commitlint'
import { resolveShellCode } from '@essex/build-utils'
import { Command } from 'commander'

export default function commitMsg(program: Command): void {
	program
		.command('commit-msg')
		.description('commit message verification (for husky hook)')
		.action(() => {
			Promise.resolve()
				.then(() => checkCommitMessage())
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
