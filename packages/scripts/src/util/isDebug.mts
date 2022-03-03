/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function isDebug() {
	return Boolean(process.env['ESSEX_DEBUG'])
}
