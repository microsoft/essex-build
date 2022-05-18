/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Linter } from 'eslint'
import { existsSync } from 'fs'

export function typescriptParserOptions(
	useTypeAwareLinting: boolean,
): Linter.ParserOptions {
	const result: Record<string, unknown> = {
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			lib: ['ESNext'],
			ecmaFeatures: {
				jsx: true,
			},
			warnOnUnsupportedTypeScriptVersion: false,
		},
	}
	if (useTypeAwareLinting) {
		result['tsconfigRootDir'] = process.cwd()
		result['project'] = getTsConfigRoots()
	}
	return result
}

function getTsConfigRoots(): string[] {
	const result: string[] = []
	// root override
	if (existsSync('./tsconfig.eslint.json')) {
		result.push('./tsconfig.eslint.json')
	} else if (existsSync('./tsconfig.json')) {
		result.push('./tsconfig.json')
	}

	// standard monorepo
	if (existsSync('./packages')) {
		result.push('./packages/*/tsconfig.json')
	}
	// multi-language monorepo
	if (existsSync('./javascript')) {
		result.push('./javascript/*/tsconfig.json')
	}
	return result
}
