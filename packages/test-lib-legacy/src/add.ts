/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export * from './rendering.js'

/**
 * Add the numbers
 *
 * @remarks
 * This is a test comment
 *
 * @param nums - The numbers to add
 * @returns The sum of the numbers
 *
 * @public
 */
export function add(...nums: number[]): number {
	return nums.reduce((prev, cur) => prev + cur, 0)
}
