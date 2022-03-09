/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Linter } from 'eslint'

import {
	javascriptOverride,
	jestOverride,
	typescriptOverride,
} from './overrides.js'
import { importSettings, reactSettings } from './settings.js'

export function createConfiguration(
	useTypeAwareLinting: boolean,
): Linter.Config & { overrides: Linter.ConfigOverride[] } {
	return {
		root: true,
		plugins: [
			'@essex/eslint-plugin',
			'header',
			'import',
			'simple-import-sort',
			'react-hooks',
		],
		parser: '@babel/eslint-parser',
		parserOptions: {
			requireConfigFile: false,
		},
		extends: [
			'eslint:recommended',
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
			...reactSettings(),
			...importSettings(),
		},
		overrides: [
			typescriptOverride(useTypeAwareLinting),
			javascriptOverride(),
			jestOverride(),
		],
	}
}
