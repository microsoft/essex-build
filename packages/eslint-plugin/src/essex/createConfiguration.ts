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

/**
 * Create an ESLint configuration object
 * @param useTypeAwareLinting - Whether to enable type-aware lint rules
 * @returns
 */
export function createConfiguration(
	useTypeAwareLintingArg: boolean,
): Linter.Config & { overrides: Linter.ConfigOverride[] } {
	const useTypeAwareLinting = getTypeAwareSetting(useTypeAwareLintingArg)
	const plugins = ['@essex/eslint-plugin', 'header', 'import', 'react-hooks']

	return {
		root: true,
		plugins,
		parser: '@babel/eslint-parser',
		parserOptions: {
			requireConfigFile: false,
		},
		extends: [
			'plugin:import/recommended',
			'plugin:react/recommended',
			'plugin:react-hooks/recommended',
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

	const skipTypecheck = process.env.SKIP_TYPEAWARE_LINTING != null
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
