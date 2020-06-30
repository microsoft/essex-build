/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { msHeader } from './msHeader'

const HEADER_OVERRIDE = join(process.cwd(), 'header.js')
// context is dist/cjs/configs/<config.ts>
const headerFile = existsSync(HEADER_OVERRIDE) ? HEADER_OVERRIDE : msHeader

const jsRuleSets: string[] = [
	/* Base Rulesets */
	'eslint:recommended',
	'plugin:react/recommended',
	/* Testing Rules */
	'plugin:jest/recommended',
	/* Disable style-based eslint rules */
	'prettier',
	'prettier/react',
]
export default {
	plugins: [
		/* Custom Essex Rules */
		'@essex',
		'header',
		/* TypeScript parsing & rules */
		'@typescript-eslint',
		/* Testing Rules */
		'jest',
	],
	env: {
		node: true,
		browser: true,
		es2020: true,
		jest: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			files: '*.ts*',
			parser: '@typescript-eslint/parser',
			extends: [
				...jsRuleSets,
				/* TypeScript Rules */
				'plugin:@typescript-eslint/recommended',
				/* Disable TypeScript styling rules */
				'prettier/@typescript-eslint',
			],
			rules: {
				'@typescript-eslint/interface-name-prefix': 0,
			},
		},
		{
			files: '*.js*',
			extends: [...jsRuleSets, 'prettier/babel'],
			parserOptions: {
				parser: 'babel-eslint',
				ecmaVersion: 2018,
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
					modules: true,
				},
			},
		},
	],
	rules: {
		'header/header': [2, headerFile],

		// Custom Rules
		'@essex/adjacent-await': 'warn',

		// Rules that we don't find useful
		'no-plusplus': 0,
	},
}
