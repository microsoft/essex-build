/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as index from '../index.js'

describe('the index', () => {
	it('an export to exist', () => {
		expect(index.bar).toBe(12345)
	})
})
