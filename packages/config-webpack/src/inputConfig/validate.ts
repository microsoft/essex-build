/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { pkgJson } from './pkgJson.js'

/**
 * Validates the webpack configuration
 */
export function validate(): void {
	if (pkgJson.homepage && !pkgJson.homepage.endsWith('/')) {
		throw new Error(
			"package.json homepage setting should end with a '/' character for the base tag to function properly",
		)
	}
	// perform any additional validation here
}
