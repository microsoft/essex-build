/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function difference<T>(main: Set<T>, remove: Set<T>): Set<T> {
	const result = new Set<T>()
	for (const v of main.values()) {
		if (!remove.has(v)) {
			result.add(v)
		}
	}
	return result
}
