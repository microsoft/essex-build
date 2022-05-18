/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createConfiguration } from './essex/createConfiguration.js'
import rules from './rules/index.js'

const defaultExport = {
	rules,
	configs: {
		base: createConfiguration(true),
		fast: createConfiguration(false),
	},
}
// @ts-ignore
export = defaultExport
