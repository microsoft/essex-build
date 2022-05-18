/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import chalk from 'chalk'
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
	useTypeAwareLinting = getTypeAwareSetting(useTypeAwareLinting)
	return {
		root: true,
		plugins: [
			'@essex/eslint-plugin',
			'header',
			'import',
			'simple-import-sort',
			'react-hooks',
			'esm',
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

function getTypeAwareSetting(defaultValue: boolean): boolean {
	if (defaultValue === false) {
		return false
	}

	const skipTypecheck = process.env['SKIP_TYPEAWARE_LINTING'] != null
	if (skipTypecheck) {
		console.warn(chalk.yellow('skipping type-aware linting'))
	} else {
		console.info(
			chalk.green(
				'type-aware linting enabled, set SKIP_TYPEAWARE_LINTING=1 to disable',
			),
		)
	}

	return !skipTypecheck
}
