/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { wrapPromiseTask, filterShellCode, gulpify } from '@essex/build-utils'
import { run } from '@essex/shellrunner'

const cwd = process.cwd()
const rollupConfigPath = join(cwd, 'rollup.config.js')

export function rollupBuild(): Promise<void> {
	if (!existsSync(rollupConfigPath)) {
		return Promise.resolve()
	} else {
		return run({
			exec: 'rollup',
			args: ['-c', rollupConfigPath],
		}).then(filterShellCode)
	}
}

export const rollupBuildGulp = gulpify(
	wrapPromiseTask('rollup', false, rollupBuild),
)
