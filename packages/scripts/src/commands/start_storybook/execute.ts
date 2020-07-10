/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run } from '@essex/shellrunner'
import { getStorybookConfigPath } from '../../utils'

export interface StartStorybookCommandOptions {
	verbose: boolean
}

export async function execute({
	verbose,
}: StartStorybookCommandOptions): Promise<number> {
	const configPath = await getStorybookConfigPath()

	const args: string[] = ['-c', configPath]
	if (!verbose) {
		args.push('--quiet')
	}

	const result = await run({
		exec: 'start-storybook',
		args,
	})
	return result.code
}
