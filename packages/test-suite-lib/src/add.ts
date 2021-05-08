/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import dataJson from './data.json'

export const data = dataJson
export function add(...nums: number[]): number {
	return nums.reduce((prev, cur) => prev + cur, 0)
}
