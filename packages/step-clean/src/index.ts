/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gulpify } from '@essex/build-utils'
import { rm } from './rm'

export async function clean(files: string[]): Promise<void> {
	const promises: Array<Promise<void>> = files.filter(f => !!f).map(f => rm(f!))
	await Promise.all(promises)
}

export const cleanGulp = gulpify('clean', clean)
