/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function getBrowsersList(
	env: string,
	setting: undefined | string[] | Record<string, string[]>,
): string | string[] {
	if (setting == null) {
		return DEFAULT_ESSEX_BROWSERSLIST
	}
	if (Array.isArray(setting)) {
		return setting
	}

	return setting[env] || DEFAULT_ESSEX_BROWSERSLIST
}

const DEFAULT_ESSEX_BROWSERSLIST = ['>0.5%', 'not IE 11', 'not dead']
