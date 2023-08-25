/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Linter } from 'eslint'

import { typescriptParserOptions } from './parserOptions.js'
import {
	defaultRules,
	importSortRules,
	jestRules,
	reactRules,
	tsRules,
} from './ruleConfigurations.js'

/**
 * This list of rules is from a spreadesheet referenced in this issue: https://github.com/rome/tools/issues/3892
 * See: https://docs.google.com/spreadsheets/d/16PXNlt7XoQG_ByRC9azLcFqPxZbIyppcb2c92O_lCv4/edit#gid=0
 */
const RULES_WITH_ROME_EQUIVALENT: string[] = [
	'@typescript-eslint/array-type',
	'@typescript-eslint/ban-types',
	'@typescript-eslint/camelcase',
	'@typescript-eslint/no-empty-interface',
	'@typescript-eslint/no-explicit-any',
	'@typescript-eslint/no-unused-vars',
	'constructor-super',
	'eqeqeq',
	'no-cond-assign',
	'no-cond-assign',
	'no-debugger',
	'no-self-compare',
	'no-sequences',
	'no-shadow',
	'no-unreachable',
	'no-unsafe-finally',
	'no-unused-vars',
	'no-var',
	'one-var',
	'use-isnan',
]

export function typescriptOverride(
	useTypeAwareLinting: boolean,
	useRome: boolean,
): Linter.ConfigOverride {
	const result = {
		files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
		parser: '@typescript-eslint/parser',
		parserOptions: typescriptParserOptions(useTypeAwareLinting),
		plugins: ['@typescript-eslint/eslint-plugin'],
		extends: [
			'plugin:import/typescript',
			'plugin:@typescript-eslint/recommended',
		],
		rules: { ...defaultRules, ...reactRules, ...tsRules },
	}
	if (!useRome) {
		result.rules = { ...result.rules, ...importSortRules }
	}

	if (useTypeAwareLinting) {
		result.extends.push(
			'plugin:@typescript-eslint/recommended-requiring-type-checking',
		)
	}
	if (useRome) {
		RULES_WITH_ROME_EQUIVALENT.forEach((rule) => {
			result.rules[rule] = 'off'
		})
	}
	return result
}
export function javascriptOverride(useRome: boolean): Linter.ConfigOverride {
	const result = {
		files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
		parser: '@babel/eslint-parser',
		parserOptions: {
			requireConfigFile: false,
		},
		rules: { ...defaultRules, ...reactRules },
	}

	if (useRome) {
		RULES_WITH_ROME_EQUIVALENT.forEach((rule) => {
			result.rules[rule] = 'off'
		})
	}
	return result
}

export function jestOverride(): Linter.ConfigOverride {
	return {
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
	}
}
