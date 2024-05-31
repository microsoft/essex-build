/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getSwcOptions } from '@essex/swc-opts'
import type { RuleSetRule } from 'webpack'

const swcLoader = require.resolve('swc-loader')

export const tsRule: RuleSetRule = {
	test: /\.tsx?$/,
	exclude: /node_modules/,
	use: { loader: swcLoader, options: getSwcOptions() },
}
