/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TaskFunction } from 'undertaker'

export function execGulpTask(task: TaskFunction): Promise<void> {
	return new Promise((resolve, reject) => {
		task(err => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
