/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { Linter } from 'eslint'
import { existsSync } from 'fs'
import { join } from 'path'
import { msHeader } from '../essex/msHeader.js'

const HEADER_OVERRIDE = join(process.cwd(), 'header.js')
const headerFile = existsSync(HEADER_OVERRIDE) ? HEADER_OVERRIDE : msHeader

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.
const restrictedGlobals = require('confusing-browser-globals')

const baselineRules: Linter.RulesRecord = {
	// http://eslint.org/docs/rules/
	'array-callback-return': 'warn',
	'default-case': ['warn', { commentPattern: '^no default$' }],
	eqeqeq: ['warn', 'smart'],
	'no-array-constructor': 'warn',
	'no-caller': 'warn',
	'no-cond-assign': ['warn', 'except-parens'],
	'no-eval': 'warn',
	'no-extend-native': 'warn',
	'no-extra-bind': 'warn',
	'no-extra-label': 'warn',
	'no-implied-eval': 'warn',
	'no-iterator': 'warn',
	'no-label-var': 'warn',
	'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
	'no-lone-blocks': 'warn',
	'no-loop-func': 'warn',
	'no-multi-str': 'warn',
	'no-native-reassign': 'warn',
	'no-negated-in-lhs': 'warn',
	'no-new-func': 'warn',
	'no-new-object': 'warn',
	'no-new-wrappers': 'warn',
	'no-octal-escape': 'warn',
	// TODO: Remove this option in the next major release of CRA.
	// https://eslint.org/docs/user-guide/migrating-to-6.0.0#-the-no-redeclare-rule-is-now-more-strict-by-default
	'no-redeclare': ['warn', { builtinGlobals: false }],
	'no-restricted-syntax': ['warn', 'WithStatement'],
	'no-script-url': 'warn',
	'no-self-assign': 'warn',
	'no-self-compare': 'warn',
	'no-sequences': 'warn',
	'no-template-curly-in-string': 'warn',
	'no-throw-literal': 'warn',
	'no-restricted-globals': ['error'].concat(
		restrictedGlobals,
	) as Linter.RuleEntry,
	'no-unused-expressions': [
		'error',
		{
			allowShortCircuit: true,
			allowTernary: true,
			allowTaggedTemplates: true,
		},
	],
	'no-unused-vars': [
		'error',
		{
			args: 'none',
			ignoreRestSiblings: true,
		},
	],
	'no-use-before-define': [
		'warn',
		{
			functions: false,
			classes: false,
			variables: false,
		},
	],
	'no-useless-computed-key': 'warn',
	'no-useless-concat': 'warn',
	'no-useless-constructor': 'warn',
	'no-useless-rename': [
		'warn',
		{
			ignoreDestructuring: false,
			ignoreImport: false,
			ignoreExport: false,
		},
	],
	'require-yield': 'warn',
	strict: ['warn', 'never'],
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
	// use simple-import-sort
	'import/order': 'off',

	// Enforce ESM Extensions
	'@essex/extensions': 'error',

	// https://github.com/lydell/eslint-plugin-simple-import-sort#usage
	'simple-import-sort/imports': 'error',
	'simple-import-sort/exports': 'error',
}

const essexPrefs: Linter.RulesRecord = {
	'no-plusplus': 'off',
	'header/header': [2, headerFile],
	'@essex/adjacent-await': 'warn',
	'no-inner-declarations': 'off',
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

	// let prettier handle semis
	'@typescript-eslint/no-extra-semi': 'off',

	// Add TypeScript specific rules (and turn off ESLint equivalents)
	'@typescript-eslint/consistent-type-assertions': 'warn',
	'no-array-constructor': 'off',
	'@typescript-eslint/no-array-constructor': 'warn',
	'no-use-before-define': 'off',
	'@typescript-eslint/no-use-before-define': [
		'warn',
		{
			functions: false,
			classes: false,
			variables: false,
			typedefs: false,
		},
	],
	'no-unused-expressions': 'off',
	'@typescript-eslint/no-unused-expressions': [
		'error',
		{
			allowShortCircuit: true,
			allowTernary: true,
			allowTaggedTemplates: true,
		},
	],
	'no-unused-vars': 'off',
	'@typescript-eslint/no-unused-vars': [
		'warn',
		{
			args: 'none',
			ignoreRestSiblings: true,
		},
	],
	'no-useless-constructor': 'off',
	'@typescript-eslint/no-useless-constructor': 'warn',
	// TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
	'default-case': 'off',
	// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
	'no-dupe-class-members': 'off',
	// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
	'no-undef': 'off',

	// Some tooling breaks on joint type/value imports (Vite) - this forces types and values to be imported separately
	'@typescript-eslint/consistent-type-imports': [
		'error',
		{
			prefer: 'type-imports',
		},
	],

	'no-redeclare': 'off',
	'@typescript-eslint/no-redeclare': ['warn'],

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

	// Not helpful for tests where clarity > optimal flow. This rule also actively interferes with acceptance tests
	'@essex/adjacent-await': 'off',
}
