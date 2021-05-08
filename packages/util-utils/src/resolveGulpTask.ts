/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { subtaskSuccess, subtaskFail, printPerf } from '@essex/tasklogger'

/**
 * Returns promise .then(...) handlers to use a promise-based task with gulp
 * @param title The task title
 * @param cb The gulp callback
 */
export function resolveGulpTask(
	title: string,
	start: number,
	cb: (err?: Error) => void,
): [() => void, (err: Error) => void] {
	const end = performance.now()
	return [
		() => {
			subtaskSuccess(`${title} ${printPerf(start, end)}`)
			cb()
		},
		err => {
			subtaskFail(`${title} ${printPerf(start, end)}`)
			cb(err)
		},
	]
}
