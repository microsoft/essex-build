/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { filterShellCode } from '@essex/build-utils'
import { run } from '@essex/shellrunner'

const cwd = process.cwd()
const rollupConfigPath = join(cwd, 'rollup.config.js')

export function rollupWatch(): Promise<void> {
	if (!existsSync(rollupConfigPath)) {
		return Promise.resolve()
	} else {
		return run({
			exec: 'rollup',
			args: ['-c', rollupConfigPath, '-w'],
		}).then(filterShellCode)
	}
}
