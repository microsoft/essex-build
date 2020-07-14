/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { gulpify, filterShellCode } from '@essex/build-utils'
import { run } from '@essex/shellrunner'

const cwd = process.cwd()
const defaultConfig = join(__dirname, '../config/commitlint.config.js')
const overrideConfig = join(cwd, 'commitlint.config.js')
const configFile = existsSync(overrideConfig) ? overrideConfig : defaultConfig

export function checkCommitMessage(): Promise<void> {
	return run({
		exec: 'commitlint',
		args: ['--config', configFile, '-E', 'HUSKY_GIT_PARAMS'],
	}).then(filterShellCode)
}

export const checkCommitMessageGulp = gulpify('commitlint', checkCommitMessage)
