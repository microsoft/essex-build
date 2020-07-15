/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as webpack from 'webpack'
import { getConfig } from './getConfig'
import { WebpackCompilerOptions } from './types'

/**
 * Gets a webpack compiler instance
 * @param config The compiler configuration
 */
export function getCompiler(config: WebpackCompilerOptions): webpack.Compiler {
	const wpConfig = getConfig(config)
	return webpack(wpConfig)
}
