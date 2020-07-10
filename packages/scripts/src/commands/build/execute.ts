/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { fail } from '../../utils/log'
import { configureTasks } from './tasks'
import { BuildCommandOptions } from './types'

export async function execute(options: BuildCommandOptions): Promise<number> {
	try {
		const build = configureTasks(options)
		await new Promise((resolve, reject) => {
			build((err?: Error) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
		return 0
	} catch (err) {
		fail('build error', err)
		return 1
	}
}