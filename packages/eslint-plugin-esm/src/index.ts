/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { extensionsRule } from './rules/extensions.js'

// Export for commonjs modules
export const rules = {
	extensions: extensionsRule,
}

// Export for esm modules
const defaultExport = { rules }
export default defaultExport