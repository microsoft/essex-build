/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Linter } from 'eslint'

export function importSettings(): Linter.Config['settings'] {
	return {
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
	}
}

export function reactSettings(): Linter.Config['settings'] {
	return {
		react: {
			version: 'detect',
		},
	}
}
