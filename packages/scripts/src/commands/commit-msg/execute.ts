/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { checkCommitMessage } from '@essex/build-step-commitlint'

export async function execute(): Promise<number> {
	return Promise.resolve()
		.then(() => checkCommitMessage())
		.then(
			() => 0,
			() => 1,
		)
}
