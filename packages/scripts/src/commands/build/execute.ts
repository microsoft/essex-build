/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { fail, success } from '../../utils/log'
import { configureTasks } from './tasks'
import { BuildCommandOptions } from './types'
import { gulpExec } from '../../utils'

export async function execute(options: BuildCommandOptions): Promise<number> {
	try {
		const build = configureTasks(options)
		await gulpExec(build)
		success('build succeeded')
		return 0
	} catch (err) {
		fail('build failed', err)
		return 1
	}
}