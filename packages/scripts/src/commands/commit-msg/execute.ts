/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { run, getConfigPath } from '../../utils'

export async function execute(): Promise<number> {
	const commitLintPath = await getConfigPath('commitlint.config.js')!
	const { code } = await run('commitlint', [
		'--config',
		commitLintPath,
		'-E',
		'HUSKY_GIT_PARAMS',
	])
	return code
}
