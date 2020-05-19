/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { rm } from './rm'

export async function execute(files: string[]): Promise<number> {
	const promises: Array<Promise<number>> = files
		.filter(f => !!f)
		.map(f => rm(f!))
	const results = await Promise.all(promises)
	return results.reduce((prev, curr) => prev + curr, 0)
}
