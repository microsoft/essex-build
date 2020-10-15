/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as rimraf from 'rimraf'

export function rm(fileglob: string): Promise<void> {
	return new Promise((resolve, reject) => {
		rimraf(fileglob, (err: Error) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
