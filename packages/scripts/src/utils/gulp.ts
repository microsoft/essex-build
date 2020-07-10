/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { subtaskSuccess, subtaskFail } from './log'

export function resolveGulpTask(
	title: string,
	cb: (err?: Error) => void,
): [() => void, (err: Error) => void] {
	return [
		() => {
			subtaskSuccess(title)
			cb()
		},
		err => {
			subtaskFail(title)
			cb(err)
		},
	]
}

export function gulpExec(
	task: (cb: (err?: Error) => void) => void,
): Promise<void> {
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
