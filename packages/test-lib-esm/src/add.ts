/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export * from './rendering.js'

import reduce from 'lodash-es/reduceRight.js'

export function add(...nums: number[]): number {
	return reduce(nums, (prev, curr) => prev + curr, 0)
}
