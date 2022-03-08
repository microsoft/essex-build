/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
// Based on eslint-config-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
import {
	defaultRules,
	jestRules,
	reactRules,
	tsRules,
} from '../essex/ruleConfigurations.js'

// Force PnP's Hand (is this still necessary?)
const { dependencies } = require('../../package.json')
Object.keys(dependencies).forEach(dep => require(dep))

const baseConfig = {
	plugins: [
		'@essex/eslint-plugin',
		'header',
		'import',
		'simple-import-sort',
		'react-hooks',
	],
	parser: '@typescript-eslint/parser',
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
	extends: [
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
		react: {
			version: 'detect',
		},
		'import/extensions': [
			'.js',
			'.jsx',
			'.cjs',
			'.mjs',
			'.ts',
			'.tsx',
			'.cts',
			'.mts',
		],
		'import/ignore': [/\\.(json)$/, /\\.(scss|less|css)$/],
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
			'@babel/eslint-parser': ['.js', '.jsx', '.cjs', '.mjs'],
		},
	},
	overrides: [
		/**
		 * TypeScript Rules
		 */
		{
			files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
			parser: '@typescript-eslint/parser',
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
			plugins: ['@typescript-eslint/eslint-plugin'],
			extends: [
				'plugin:import/typescript',
				'plugin:@typescript-eslint/recommended',
			],
			rules: { ...defaultRules, ...reactRules, ...tsRules },
		},
		/**
		 * JS Rules
		 */
		{
			files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
			parser: '@babel/eslint-parser',
			parserOptions: {
				requireConfigFile: false,
			},
			rules: { ...defaultRules, ...reactRules },
		},
		/**
		 * Jest Rules
		 */
		{
			files: ['**/*.spec.*', '**/*.test.*'],
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
			rules: { ...jestRules },
		},
	],
}

export default baseConfig
