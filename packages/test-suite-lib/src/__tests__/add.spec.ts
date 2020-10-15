/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { add } from '../add'

describe('the adder', () => {
	it('can add 2 and 2', () => {
		expect(add(2, 2)).toEqual(4)
	})
	it('can add 3 and 5', () => {
		expect(add(3, 5)).toEqual(8)
	})
})
