/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TSESLint } from '@typescript-eslint/utils'
import micromatch from 'micromatch'
import { relative } from 'path'

import { defaultSettings } from './extensions.defaults.js'
import { ExtensionsDoc } from './extensions.docs.js'
import type { ExtensionMessageIds } from './extensions.messages.js'
import { ExtensionMessages } from './extensions.messages.js'
import type { ExtensionsArguments } from './extensions.schema.js'
import { extensionsArgSchema } from './extensions.schema.js'
import { createExtensionsValidator } from './extensions.validator.js'


export const extensionsRule: TSESLint.RuleModule<
	ExtensionMessageIds,
	[ExtensionsArguments]
> = {
	meta: {
		type: 'problem',
		docs: ExtensionsDoc,
		messages: ExtensionMessages,
		schema: [extensionsArgSchema],
	},
	create: context => {
		/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
		const filename = relative(context.getCwd!(), context.getFilename())
		const allOptions = [...(context.options[0] ?? [defaultSettings])].map(
			opt => ({
				...defaultSettings,
				...opt,
			}),
		)

		const matchingOptions = allOptions.filter(opt => {
			return micromatch.isMatch(filename, opt.files)
		})[0]

		if (matchingOptions === undefined) {
			// current filepath does not match any of the provided glob patterns
			// for any of the defined linting rules. Skip linting.
			return {}
		}

		const extensionValidator = createExtensionsValidator(
			matchingOptions,
			context,
		)

		return {
			ImportDeclaration: extensionValidator,
			ImportExpression: extensionValidator,
			ExportAllDeclaration: extensionValidator,
			ExportNamedDeclaration: extensionValidator,
		}
	},
}
