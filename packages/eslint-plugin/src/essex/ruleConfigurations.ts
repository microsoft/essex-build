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

const baselineRules: Linter.RulesRecord = {
	// http://eslint.org/docs/rules/
	'array-callback-return': 'error',
	'no-caller': 'error',
	'no-extend-native': 'error',
	'no-extra-bind': 'error',
	'no-implied-eval': 'error',
	'no-iterator': 'error',
	'no-loop-func': 'error',
	'no-multi-str': 'error',
	'no-new-func': 'error',
	'no-new-object': 'error',
	'no-new-wrappers': 'error',
	'no-octal-escape': 'error',
	'no-restricted-syntax': ['error', 'WithStatement'],
	'no-script-url': 'error',
	'no-template-curly-in-string': 'warn',
	'no-throw-literal': 'error',
	'no-unused-expressions': [
		'error',
		{
			allowShortCircuit: true,
			allowTernary: true,
			allowTaggedTemplates: true,
		},
	],
	'no-useless-concat': 'warn',
	'no-restricted-properties': [
		'error',
		{
			object: 'require',
			property: 'ensure',
			message:
				'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
		},
		{
			object: 'System',
			property: 'import',
			message:
				'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
		},
	],
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
	'@typescript-eslint/interface-name-prefix': 'off',
	// Conflicts with tsconfig paths, and with ts using es6 style imports e.g. (from './module.js')
	'import/no-unresolved': 'off',

	// let the formatter handle semis
	'@typescript-eslint/no-extra-semi': 'off',

	// Add TypeScript specific rules (and turn off ESLint equivalents)
	'@typescript-eslint/consistent-type-assertions': 'warn',
	'no-array-constructor': 'off',
	'@typescript-eslint/no-array-constructor': 'warn',
	'no-unused-expressions': 'off',
	'@typescript-eslint/no-unused-expressions': [
		'error',
		{
			allowShortCircuit: true,
			allowTernary: true,
			allowTaggedTemplates: true,
		},
	],
	// TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
	'default-case': 'off',
	// TS/ESlint clashing
	'@typescript-eslint/no-unnecessary-type-assertion': 0,
}

export const reactRules: Linter.RulesRecord = {
	// This isn't necessary in React 17
	'react/react-in-jsx-scope': 'off',
	// https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
	'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
	'react/jsx-no-comment-textnodes': 'warn',
	'react/jsx-no-duplicate-props': 'warn',
	'react/jsx-no-target-blank': 'warn',
	'react/jsx-no-undef': 'error',
	'react/jsx-pascal-case': [
		'warn',
		{
			allowAllCaps: true,
			ignore: [],
		},
	],
	'react/jsx-uses-react': 'warn',
	'react/jsx-uses-vars': 'warn',
	'react/no-danger-with-children': 'warn',
	// Disabled because of undesirable warnings
	// See https://github.com/facebook/create-react-app/issues/5204 for
	// blockers until its re-enabled
	// 'react/no-deprecated': 'warn',
	'react/no-direct-mutation-state': 'warn',
	'react/no-is-mounted': 'warn',
	'react/no-typos': 'error',
	'react/require-render-return': 'error',
	'react/style-prop-object': 'warn',

	'react-hooks/exhaustive-deps': 'warn',
	// https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
	'react-hooks/rules-of-hooks': 'error',
	'react/prop-types': 'off',
}

export const jestRules: Linter.RulesRecord = {
	// Jest @jest-environment directive cause header rule to fail
	'header/header': 'off',
}
