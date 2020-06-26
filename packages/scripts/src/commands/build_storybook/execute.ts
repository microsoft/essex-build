/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getStorybookConfigPath } from '../../utils'
import { runSequential } from '@essex/shellrunner'

export interface BuildStorybookCommandOptions {
	verbose: boolean
}

export async function execute({
	verbose,
}: BuildStorybookCommandOptions): Promise<number> {
	const configPath = await getStorybookConfigPath()

	const args: string[] = ['-c', configPath]
	if (!verbose) {
		args.push('--quiet')
	}

	return runSequential({
		exec: 'build-storybook',
		args,
	})
}
