/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { performance } from 'perf_hooks'
;(global as any).ESSEX_START = performance.now()

export function processStart(): number {
	return (global as any).ESSEX_START as number
}

export function now(): number {
	return performance.now()
}
