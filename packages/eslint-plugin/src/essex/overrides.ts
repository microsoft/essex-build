/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Linter } from 'eslint'

import { typescriptParserOptions } from './parserOptions.js'
import {
	biomeDisablesJS,
	biomeDisablesTS,
	defaultRules,
	jestRules,
	reactRules,
	tsRules,
} from './ruleConfigurations.js'

export function typescriptOverride(
	useTypeAwareLinting: boolean,
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
		rules: {
			...defaultRules,
			...reactRules,
			...tsRules,
			...biomeDisablesJS,
			...biomeDisablesTS,
		},
	}

	if (useTypeAwareLinting) {
		result.extends.push(
			'plugin:@typescript-eslint/recommended-requiring-type-checking',
		)
	}
	return result
}
export function javascriptOverride(): Linter.ConfigOverride {
	return {
		files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
		parser: '@babel/eslint-parser',
		parserOptions: {
			requireConfigFile: false,
		},
		rules: { ...defaultRules, ...reactRules, ...biomeDisablesJS },
	}
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
