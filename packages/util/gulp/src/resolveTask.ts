/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { subtaskSuccess, subtaskFail } from '@essex/tasklogger'

export function resolveTask(name: string): [() => void, (err: Error) => void] {
	return [
		() => subtaskSuccess(name),
		(err: Error) => {
			subtaskFail(name)
			throw err
		},
	]
}
