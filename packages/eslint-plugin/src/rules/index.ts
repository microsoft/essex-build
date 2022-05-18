/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import adjacentAwait from './adjacent-await.js'
import { extensionsRule } from './extensions.js'

const rules = {
	'adjacent-await': adjacentAwait,
	extensions: extensionsRule,
}

export default rules
