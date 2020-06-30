/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'colors'
import { Job } from './types'
const debugLog = (...args: any[]): void => console.log(...args)

export function subtaskFail(text: string): void {
	console.log(`    ✘ ${text}`.red)
}

export function subtaskSuccess(text: string): void {
	console.log(`    ✔ ${text}`.green)
}

export function debug(
	text: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	...args: any[]
): void {
	debugLog(text, ...args)
}

export function printJob(job: Job): void {
	debugLog(`Job@[${[job.exec, ...job.args].join(' ')}`)
}
