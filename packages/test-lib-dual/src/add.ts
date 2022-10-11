/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export * from './rendering.js'

/**
 * Sum together a series of numbers
 * @param nums - The numbers to add
 * @returns The sum of the input numbers
 */
export function add(...nums: number[]): number {
	return nums.reduce((prev, cur) => prev + cur, 0)
}
