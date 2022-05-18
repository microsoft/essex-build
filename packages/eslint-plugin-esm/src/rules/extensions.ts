/**
 * Lint relative import/export paths for the presence of
 * file extensions according to provided settings.
 *
 * Allow to apply different linting rules to different
 * sets of files. This aligns with Nodes capability of allowing
 * both esm (.mjs) and commonjs (.cjs) modules to exist in
 * one project.
 * - Allow for enforcing file extensions to be used in esm modules
 * - Allow for forbidding the use of file extensionsin cjs modules
 */

import type { TSESLint } from '@typescript-eslint/utils'
import micromatch from 'micromatch'
import { relative } from 'path'
import { defaultSettings } from './extensions.defaults.js'
import { ExtensionsDoc } from './extensions.docs.js'
import {
	ExtensionMessageIds,
	ExtensionMessages,
} from './extensions.messages.js'
import {
	extensionsArgSchema,
	ExtensionsArguments,
} from './extensions.schema.js'
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
