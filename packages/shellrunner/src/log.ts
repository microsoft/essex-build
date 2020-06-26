/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'colors'

export function subtaskFail(text: string): void {
	console.log(`    ✘ ${text}`.red)
}

export function subtaskSuccess(text: string): void {
	console.log(`    ✔ ${text}`.green)
}
