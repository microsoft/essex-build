import * as tsParser from '@typescript-eslint/parser'
import type { Rule, RuleTester as RT } from 'eslint'
import { RuleTester } from 'eslint'
import { readFileSync } from 'fs'
import { basename, dirname, extname, relative, resolve } from 'path'
// import { fileURLToPath } from 'url'

import { extensionsRule } from '../../rules/extensions.js'
import { ExtensionMessageIds } from '../../rules/extensions.messages.js'

// const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Arrange tests
 *
 * Setup common test fixtures and variables.
 *
 * ruleSettings - must be passed into individual tests.
 * RuleTester does not allow configuring default rule settings
 * at the global level as one would do with a .eslintrc file
 *
 * tsRuleTester - eslint using a typescript parser.
 * All eslint parser produce compatible ASTs so these
 * linting rules work on both TS source and esm based JS files
 */
const ruleSettings = [
	{
		// esm files should enforce extensions
		files: ['**/esm/*.{ts,tsx,js,jsx,mjs,mts}'],
		ignorePackages: true,
		relativeModulePrefixes: ['./', '~'],
		expectedExtensions: ['.js', '.css'],
	},
	{
		// cjs files should prevent the use of extensions
		files: ['**/cjs/*.{ts,tsx,js,jsx,cjs,cts}'],
		ignorePackages: true,
		relativeModulePrefixes: ['./', '~'],
		expectedExtensions: [],
		disallowedExtensions: [
			'.js',
			'.ts',
			'.tsx',
			'.cts',
			'.mts',
			'.jsx',
			'.cjs',
		],
	},
]

const tsRuleTester = new RuleTester({
	parser: tsParser,
	parserOptions: {
		ecmaVersion: '2022',
		sourceType: 'module',
		project: '../../tsconfig.json',
	},
})

// Utility for loading valid or invalid test cases from a text file.
// If an errorMessageId is provided than the returned test cases
// are expected to fail.
function getTestCases<T extends RT.ValidTestCase | RT.InvalidTestCase>(
	filepath: string,
	errorMessageId?: string,
): T[] {
	const fileContents = readFileSync(filepath, 'utf-8')
	return fileContents.split('###').map((line: string): T => {
		return {
			name: `${relative(process.cwd(), filepath)} - ${line.trim()}`,
			code: line.trim(),
			filename: resolve(
				dirname(filepath),
				`${basename(filepath, extname(filepath))}.ts`,
			),
			options: [ruleSettings],
			...(errorMessageId != null && {
				errors: [{ messageId: errorMessageId }],
			}),
		} as T
	})
}

const esmValidTestCases = getTestCases<RT.ValidTestCase>(
	resolve(__dirname, '../fixtures/esm/valid.txt'),
)
const esmInvalidTestCases = getTestCases<RT.InvalidTestCase>(
	resolve(__dirname, '../fixtures/esm/invalid.txt'),
	ExtensionMessageIds.Expected,
)
const cjsValidTestCases = getTestCases<RT.ValidTestCase>(
	resolve(__dirname, '../fixtures/cjs/valid.txt'),
)
const cjsInvalidTestCases = getTestCases<RT.InvalidTestCase>(
	resolve(__dirname, '../fixtures/cjs/invalid.txt'),
	ExtensionMessageIds.Disallowed,
)

/**
 * Act and Assert
 *
 * tsRuleTester will lint all code samples provided against the
 * provided and configured rules.
 * ruleTester hooks into globally defined test runner describe/it
 * functions so it will use jest/mocha/etc for test reporting.
 */
tsRuleTester.run('extensions', extensionsRule as unknown as Rule.RuleModule, {
	valid: [...esmValidTestCases, ...cjsValidTestCases],
	invalid: [...esmInvalidTestCases, ...cjsInvalidTestCases],
})
