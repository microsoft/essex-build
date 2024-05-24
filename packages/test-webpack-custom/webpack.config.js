/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import essexWebpackConfig from '@essex/webpack-config'

const configuration = essexWebpackConfig.configure({
	environment: (mode, env) => {
		if (mode !== 'production') {
			throw new Error('expected production mode')
		}
		if (env !== 'production') {
			throw new Error('expected production env')
		}
		return {
			testApi: 'http://localhost:8080',
		}
	},
})

// biome-ignore lint/style/noDefaultExport: This is a configuration file
export default configuration
