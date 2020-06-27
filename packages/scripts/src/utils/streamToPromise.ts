/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stream } from 'stream'
import { subtaskSuccess, subtaskFail } from './log'

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function streamToPromise(stream: Stream, title: string): Promise<void> {
	return new Promise((resolve, reject) => {
		stream
		.on('finish', () => {
			subtaskSuccess(title)
			resolve()
		})
		.on('error', (err) => {
			subtaskFail(title)
			reject(err)
		})
	})
}
