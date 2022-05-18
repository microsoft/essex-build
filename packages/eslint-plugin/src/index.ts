/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createConfiguration } from './essex/createConfiguration.js'
import rules from './rules/index.js'

export = {
	rules,
	configs: {
		base: createConfiguration(true),
		fast: createConfiguration(false),
	},
}
