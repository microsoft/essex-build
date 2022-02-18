/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import reduce from 'lodash-es/reduceRight.js'
export * from './rendering.js'

export function add(...nums: number[]): number {
	return reduce(nums, (prev, curr) => prev + curr, 0)
}
