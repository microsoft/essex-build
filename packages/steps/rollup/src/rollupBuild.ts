/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { resolveGulpTask, filterShellCode } from '@essex/build-utils-gulp'
import { run } from '@essex/shellrunner'

const cwd = process.cwd()
const rollupConfigPath = join(cwd, 'rollup.config.js')

export function rollupBuild(cb: (err?: Error) => void) {
	if (!existsSync(rollupConfigPath)) {
		return cb()
	} else {
		run({
			exec: 'rollup',
			args: ['-c', rollupConfigPath],
		})
			.then(filterShellCode)
			.then(...resolveGulpTask('rollup', cb))
	}
}
