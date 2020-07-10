/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Job, run } from '@essex/shellrunner'
import { getWebpackBundleConfigPath } from '../../utils'
import { getWebpackArgs } from '../../utils/webpack'
import { BundleMode } from '../build/types'

export interface BundleCommandOptions {
	mode: BundleMode
	env: string
	verbose: boolean
}

export async function execute(config: BundleCommandOptions): Promise<number> {
	const runs: Array<Job> = []
	const webpackConfigPath = await getWebpackBundleConfigPath()

	runs.push({
		exec: 'webpack',
		args: getWebpackArgs(webpackConfigPath, config),
	})

	const { code } = await run(runs)
	return code
}
