/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stream } from 'stream'

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function streamToPromise(stream: Stream) {
	return new Promise(function (resolve, reject) {
		stream.on('finish', resolve).on('error', reject)
	})
}
