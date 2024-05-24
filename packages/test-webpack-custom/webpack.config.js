/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const essexWebpackConfig = require('@essex/webpack-config')

const configuration = essexWebpackConfig.configure({
	environment: (_mode, _env) => {
		return {
			// biome-ignore lint/style/useNamingConvention: env var
			TEST_API: 'http://localhost:8080',
		}
	},
})

module.exports = configuration
