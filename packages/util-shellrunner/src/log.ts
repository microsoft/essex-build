/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import dbg from 'debug'

import type { Job } from './types.js'

const debugLog = dbg('essex:shellrunner')

export function debug(text: string, ...args: unknown[]): void {
	debugLog(text, ...args)
}

export function printJob(job: Job): void {
	debugLog(`Job@[${[job.exec, ...job.args].join(' ')}`)
}
