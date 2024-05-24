/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import 'zx/globals'

import type { Command } from 'commander'
import isGitDirty from 'is-git-dirty'

// biome-ignore lint/style/noDefaultExport: this is a CLI command
export default function start(program: Command): void {
	program
		.command('git-is-clean')
		.description('verifies that there are no active git changes')
		.action(async () => {
			/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			const isDirty = isGitDirty()
			if (isDirty) {
				await $`git status`.pipe(process.stdout)
			}
			process.exitCode = isDirty ? 1 : 0
		})
}
