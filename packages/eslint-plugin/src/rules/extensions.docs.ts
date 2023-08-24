/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TSESLint } from '@typescript-eslint/utils'

export const ExtensionsDoc: TSESLint.RuleMetaDataDocs = {
	description:
		'Enforce the use of file extensions in import/export paths ' +
		'within esm modules or prevent the use of file extensions in ' +
		'import/export paths within commonjs modules.',
	recommended: 'recommended',
	url: 'https://github.com/microsoft/essex-js-build/blob/main/packages/eslint-plugin/docs/rules/extensions.md',
}
