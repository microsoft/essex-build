/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { resolveGulpTask } from './resolveGulpTask'
import { GulpyCallback, GulpyTask } from './types'

export function gulpify(
	title: string,
	task: (...args: any[]) => Promise<any>,
): (...args: any[]) => GulpyTask {
	return (...args: any[]) => (cb: GulpyCallback): void => {
		const start = performance.now()
		Promise.resolve(task(...args)).then(...resolveGulpTask(title, start, cb))
	}
}
