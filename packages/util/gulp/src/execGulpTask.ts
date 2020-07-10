/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function execGulpTask(
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
