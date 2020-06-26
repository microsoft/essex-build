/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run } from '@essex/shellrunner'

/**
 * Verifies that there are no active changes in the git index.
 */
export async function execute(): Promise<number> {
	const { code } = await run({
		exec: 'git',
		args: ['diff-index', '--quiet', 'HEAD'],
	})
	return code
}
