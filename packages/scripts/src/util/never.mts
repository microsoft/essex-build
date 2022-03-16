/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function never(): Promise<void> {
	return new Promise(() => {
		/* never resolve */
	})
}
