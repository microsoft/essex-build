/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
describe('the test command', () => {
	it('works', () => {
		const value = { a: { b: { c: true } } }
		expect(value?.a?.b?.c).toBeTruthy()
	})
})
