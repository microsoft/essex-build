/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GulpyTask } from './types'

export function gulpify(
	task: (...args: any[]) => Promise<void>,
): (...args: any) => GulpyTask {
	return (...args: any[]) =>
		() =>
			task(...args)
}
