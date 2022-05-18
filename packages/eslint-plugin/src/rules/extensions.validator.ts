/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TSESLint } from '@typescript-eslint/utils'
import { TSESTree } from '@typescript-eslint/utils'
import { extname } from 'path'

import { ExtensionMessageIds } from './extensions.messages.js'
import type {
	ExtensionsArguments,
	ExtensionsOptions,
} from './extensions.schema.js'

export function createExtensionsValidator(
	{
		ignorePackages,
		expectedExtensions,
		disallowedExtensions,
		relativeModulePrefixes,
	}: Required<ExtensionsOptions>,
	context: TSESLint.RuleContext<ExtensionMessageIds, [ExtensionsArguments]>,
): (
	node:
		| TSESTree.ImportDeclaration
		| TSESTree.ImportExpression
		| TSESTree.ExportAllDeclaration
		| TSESTree.ExportNamedDeclaration,
) => void {
	return function extensionValidator(node) {
		/**
		 * node.source == null || node.source !== StringLiteral
		 * indicates importing/exporting expressions such as export class SomeClass ...
		 * or export const variable = ...
		 * return in these cases as there is nothing to lint.
		 */
		if (node.source === null || !isStringLiteral(node.source)) return

		const importedModule = node.source.value
		const moduleExtension = extname(importedModule)

		if (
			ignorePackages &&
			!relativeModulePrefixes.some(prefix => importedModule.startsWith(prefix))
		) {
			// current import/export path is not a relative path so skip linting
			return
		}

		if (
			expectedExtensions.length > 0 &&
			!expectedExtensions.includes(moduleExtension)
		) {
			context.report({
				node,
				messageId: ExtensionMessageIds.Expected,
				data: {
					extensions: expectedExtensions.join(', '),
				},
			})
		}

		if (
			moduleExtension !== '' &&
			disallowedExtensions.length > 0 &&
			(disallowedExtensions.includes('*') ||
				disallowedExtensions.includes(moduleExtension))
		) {
			context.report({
				node,
				messageId: ExtensionMessageIds.Disallowed,
				data: {
					extension: moduleExtension,
				},
			})
		}
	}
}

function isStringLiteral(
	expression: TSESTree.Expression,
): expression is TSESTree.StringLiteral {
	return (
		expression.type === TSESTree.AST_NODE_TYPES.Literal &&
		expression.value != null &&
		typeof expression.value === 'string'
	)
}
