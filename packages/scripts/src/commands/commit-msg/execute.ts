/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getConfigPath } from '../../utils'
import { commitlint } from '@essex/build-step-commitlint'

export async function execute(): Promise<number> {
	try {
		const commitLintPath = await getConfigPath('commitlint.config.js')!
		commitlint({
			config: commitLintPath,
			env: 'HUSKY_GIT_PARAMS',
		})
		return 0
	} catch (err) {
		console.error('error running commitlint', err)
		return 1
	}
}
