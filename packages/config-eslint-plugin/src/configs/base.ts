/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
// Based on eslint-config-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
import {
	javascriptOverride,
	jestOverride,
	typescriptOverride,
} from '../essex/overrides.js'
import { typescriptParserOptions } from '../essex/parserOptions.js'
import { importSettings, reactSettings } from '../essex/settings.js'

// Force PnP's Hand (is this still necessary?)
const { dependencies } = require('../../package.json') as {
	dependencies: Record<string, string>
}
Object.keys(dependencies).forEach(dep => require(dep) as unknown)

const baseConfig = {
	plugins: [
		'@essex/eslint-plugin',
		'header',
		'import',
		'simple-import-sort',
		'react-hooks',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: typescriptParserOptions(true),
	extends: [
		'eslint:recommended',
		'prettier',
		'plugin:import/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended',
	],
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	settings: {
		...reactSettings(),
		...importSettings(),
	},
	overrides: [typescriptOverride(true), javascriptOverride(), jestOverride()],
}

export default baseConfig
