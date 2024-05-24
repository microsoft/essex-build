/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */

import { existsSync } from 'fs'
import { join } from 'path'
import type { Linter } from 'eslint'

import { msHeader } from '../essex/msHeader.js'

const HEADER_OVERRIDE = join(process.cwd(), 'header.js')
const headerFile = existsSync(HEADER_OVERRIDE) ? HEADER_OVERRIDE : msHeader

// https://eslint.org/docs/latest/rules/
const baselineRules: Linter.RulesRecord = {
	// Recommended rules not covered by Biome
	'no-constant-binary-expression': 'error',
	'no-invalid-regexp': 'error',
	'no-irregular-whitespace': 'error',
	'no-unexpected-multiline': 'error',
	'no-useless-backreference': 'error',
	'no-nonoctal-decimal-escape': 'error',
	'no-octal': 'error',
	'no-useless-escape': 'error',

	// Rules we like
	'array-callback-return': 'error',
	'no-caller': 'error',
	'no-extend-native': 'error',
	'no-extra-bind': 'error',
	'no-implied-eval': 'error',
	'no-iterator': 'error',
	'no-loop-func': 'error',
	'no-new-func': 'error',
	'no-new-wrappers': 'error',
	'no-script-url': 'error',
	'no-template-curly-in-string': 'warn',
	'no-throw-literal': 'error',
	'no-useless-concat': 'warn',
}
const importRules: Linter.RulesRecord = {
	// https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
	'import/first': 'error',
	'import/no-amd': 'error',
	'import/no-anonymous-default-export': 'warn',
	'import/no-webpack-loader-syntax': 'error',
	// use essex extensions
	'import/extensions': 'off',
	'import/order': 'off',
}

const essexPrefs: Linter.RulesRecord = {
	'header/header': [2, headerFile],
}

// Based on eslint-config-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
export const defaultRules: Linter.RulesRecord = {
	...baselineRules,
	...importRules,
	...essexPrefs,
}

// If adding a typescript-eslint version of an existing ESLint rule,
// make sure to disable the ESLint rule here.
export const tsRules: Linter.RulesRecord = {
	// Conflicts with tsconfig paths, and with ts using es6 style imports e.g. (from './module.js')
	'import/no-unresolved': 'off',
}

export const reactRules: Linter.RulesRecord = {
	// This isn't necessary in React 17
	'react/react-in-jsx-scope': 'off',
	// https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
	'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
	'react/jsx-pascal-case': [
		'warn',
		{
			allowAllCaps: true,
			ignore: [],
		},
	],
	'react/no-typos': 'error',
	'react/style-prop-object': 'warn',
	'react-hooks/exhaustive-deps': 'warn',
	// https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
	'react-hooks/rules-of-hooks': 'error',
	'react/prop-types': 'off',
}

// These rules are handled by Biome (https://github.com/biomejs/biome/discussions/3), and are included in recommendations.
export const biomeDisablesJS: Linter.RulesRecord = {
	// These rules are in eslint-plugin-react/recommended (https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/recommended.js)
	'react/jsx-key': 'off',
	'react/jsx-no-comment-textnodes': 'off',
	'react/jsx-no-duplicate-props': 'off',
	'react/jsx-no-target-blank': 'off',
	'react/jsx-no-undef': 'off',
	'react/no-children-prop': 'off',
	'react/no-danger-with-children': 'off',
}

// These rules are handled by Biome (https://github.com/biomejs/biome/discussions/3), and are included in recommendations.
export const biomeDisablesTS: Linter.RulesRecord = {
	// These rules are in @typescript-eslint/recommended (https://typescript-eslint.io/rules/?=recommended)
	'@typescript-eslint/ban-types': 'off',
	'@typescript-eslint/no-explicit-any': 'off',
	'@typescript-eslint/no-extra-non-null-assertion': 'off',
	'@typescript-eslint/no-misused-new': 'off',
	'@typescript-eslint/no-namespace': 'off',
	'@typescript-eslint/no-this-alias': 'off',
	'@typescript-eslint/no-unsafe-declaration-merging': 'off',
	'@typescript-eslint/prefer-as-const': 'off',
}

export const jestRules: Linter.RulesRecord = {
	// Jest @jest-environment directive cause header rule to fail
	'header/header': 'off',
}
