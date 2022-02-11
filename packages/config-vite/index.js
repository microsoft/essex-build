/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { default: resolve } = require('@rollup/plugin-node-resolve')
const reactRefresh = require('@vitejs/plugin-react-refresh')
const { default: reactJsx } = require('vite-react-jsx')
const { default: tsconfigPaths } = require('vite-tsconfig-paths')

module.exports = {
	build: {
		target: 'es2020',
	},
	plugins: [
		reactRefresh(),
		tsconfigPaths(),
		reactJsx(),
		resolve({ extensions: ['.js', '.ts'] }),
	],
}
