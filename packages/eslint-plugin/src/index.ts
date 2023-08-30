/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createConfiguration } from './essex/createConfiguration.js'

const defaultExport = {
	configs: {
		base: createConfiguration(true, false),
		fast: createConfiguration(false, false),
		rome: createConfiguration(true, true),
		romefast: createConfiguration(false, true),
	},
}
// @ts-ignore
export = defaultExport
