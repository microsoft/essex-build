/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function getMode(isDevelopment: boolean) {
	return isDevelopment ? 'development' : 'production'
}
