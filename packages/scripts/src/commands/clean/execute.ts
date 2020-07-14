/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { clean } from '@essex/build-step-clean'

export function execute(files: string[]): Promise<number> {
	return Promise.resolve()
		.then(() => clean(files))
		.then(
			() => 0,
			() => 1,
		)
}
