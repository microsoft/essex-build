/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { checkCommitMessage } from '@essex/build-step-commitlint'
import { Command } from 'commander'

export default function commitMsg(program: Command): void {
	program
		.command('commit-msg')
		.description('commit message verification (for husky hook)')
		.action(() => {
			return Promise.resolve()
				.then(() => checkCommitMessage())
				.catch(err => {
					console.error('error in commit-msg', err)
					process.exitCode = 1
				})
		})
}
