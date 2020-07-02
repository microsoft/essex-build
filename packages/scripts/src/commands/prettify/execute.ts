/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { resolveTask } from '../../utils'
import { prettyQuick } from '@essex/build-step-pretty-quick'

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
