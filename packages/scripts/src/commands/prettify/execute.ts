/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { prettyQuick } from '@essex/build-step-pretty-quick'
import { resolveTask } from '@essex/build-utils'

export interface PrettierCommandOptions {
	verbose: boolean
	staged: boolean
}

export function execute({
	verbose,
	staged,
}: PrettierCommandOptions): Promise<number> {
	return prettyQuick({
		staged,
		verbose,
	})
		.then(...resolveTask('prettify'))
		.then(() => 0)
		.catch(() => 1)
}
