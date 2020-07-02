/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getWebpackBundleConfigPath } from '../../utils'
import { getWebpackArgs } from '../../utils/webpack'
import { BundleMode } from '../build/execute'
import { Job, run } from '@essex/shellrunner'

export interface ServeCommandOptions {
	mode: BundleMode
	env: string
	verbose: boolean
}

export async function execute(config: ServeCommandOptions): Promise<number> {
	const runs: Array<Job> = []
	const webpackConfigPath = await getWebpackBundleConfigPath()

	runs.push({
		exec: 'webpack-dev-server',
		args: getWebpackArgs(webpackConfigPath, config),
	})

	const result = await run(runs)
	return result.code
}
