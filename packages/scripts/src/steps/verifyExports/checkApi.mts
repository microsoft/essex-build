/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function checkApi(
	imported: Record<string, unknown>,
	expected: Record<string, string>,
): void {
	const errors: string[] = []
	Object.keys(imported).forEach((key) => {
		if (!expected[key]) {
			errors.push(`unexpected export "${key}": "${typeof imported[key]}"`)
		}
		const expectedType = expected[key]
		const actualType = typeof imported[key]

		if (expectedType && expectedType !== actualType) {
			errors.push(
				`type mismatch on key "${key}": expected ${expectedType}, got ${actualType}`,
			)
		}
	})
	Object.keys(expected).forEach((key) => {
		if (!imported[key]) {
			errors.push(`missing export "${key}": "${expected[key] || 'undefined'}"`)
		}
	})

	if (errors.length > 0) {
		throw new Error(errors.join('\n'))
	}
}
