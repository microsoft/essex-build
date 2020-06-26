/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getConfigPath } from '../../utils'
import { runSequential } from '@essex/shellrunner'

export async function execute(): Promise<number> {
	const commitLintPath = await getConfigPath('commitlint.config.js')!
	const code = await runSequential({
		exec: 'commitlint',
		args: ['--config', commitLintPath, '-E', 'HUSKY_GIT_PARAMS'],
	})
	return code
}
