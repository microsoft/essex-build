/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
// Based on eslint-config-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
import {
	TYPESCRIPT_FILES,
	JEST_FILES,
	REACT_FILES,
} from '../essex/constants.js'
import {
	defaultRules,
	tsRules,
	reactRules,
	jestRules,
} from '../essex/ruleConfigurations.js'

// Force PnP's Hand (is this still necessary?)
const { dependencies } = require('../../package.json')
Object.keys(dependencies).forEach(dep => require(dep))

const baseConfig = {
	plugins: [
		'@essex/eslint-plugin',
		'eslint-plugin-header',
		'eslint-plugin-import',
		'eslint-plugin-react-hooks',
	],
	parser: '@babel/eslint-parser',
	extends: [
		'plugin:react-hooks/recommended',
		'prettier',
		'plugin:import/recommended',
	],
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	rules: defaultRules,
	overrides: [
		/**
		 * TypeScript Rules
		 */
		{
			files: TYPESCRIPT_FILES,
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint/eslint-plugin'],
			extends: [
				'plugin:import/typescript',
				'plugin:@typescript-eslint/recommended',
			],
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				lib: ['ESNext'],
				ecmaFeatures: {
					jsx: true,
				},
				// typescript-eslint specific options
				warnOnUnsupportedTypeScriptVersion: false,
			},
			rules: tsRules,
		},
		/**
		 * Jest Rules
		 */
		{
			files: JEST_FILES,
			plugins: ['eslint-plugin-jest'],
			extends: ['plugin:jest/recommended', 'plugin:jest/style'],
			settings: {
				jest: {
					version: 27,
				},
			},
			env: {
				'jest/globals': true,
			},
			rules: jestRules,
		},
		/**
		 * React Rules
		 */
		{
			files: REACT_FILES,
			extends: ['plugin:react/recommended', 'plugin:jsx-a11y/recommended'],
			plugins: ['eslint-plugin-react', 'eslint-plugin-jsx-a11y'],
			settings: {
				react: {
					version: 'detect',
				},
			},
			rules: reactRules,
		},
	],
}

export default baseConfig
