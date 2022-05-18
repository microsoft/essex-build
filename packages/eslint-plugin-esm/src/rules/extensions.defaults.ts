/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ExtensionsOptions } from './extensions.schema.js'

export const defaultSettings: Required<ExtensionsOptions> = {
	files: ['**/*.{ts,tsx,js,jsx,mts,mjs}'],
	ignorePackages: true,
	relativeModulePrefixes: ['./'],
	expectedExtensions: ['.js', '.mjs', '.cjs', '.jsx'],
	disallowedExtensions: [],
}
