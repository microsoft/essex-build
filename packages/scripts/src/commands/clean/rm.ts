/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as rimraf from 'rimraf'
import { log } from '../../utils'

export function rm(fileglob: string): Promise<number> {
	return new Promise(resolve => {
		rimraf(fileglob, (err: Error) => {
			if (err) {
				console.error(err)
				log.subtaskFail(`clean ${fileglob} failed`)
				resolve(1)
			} else {
				log.subtaskSuccess(`clean ${fileglob} passed`)
				resolve(0)
			}
		})
	})
}
