/**
 * Documentation to accompany the extensions rule
 *
 * eslint will use this to recommend default settings
 * and editors will display this documentation and a link
 * to the url for external docs
 */

import type { TSESLint } from '@typescript-eslint/utils'

export const ExtensionsDoc: TSESLint.RuleMetaDataDocs = {
	description:
		'Enforce the use of file extensions in import/export paths ' +
		'within esm modules or prevent the use of file extensions in ' +
		'import/export paths within commonjs modules.',
	recommended: 'error',
	url: 'https://github.com/microsoft/essex-js-build/blob/main/packages/eslint-plugin-esm/docs/rules/extensions.md',
}
