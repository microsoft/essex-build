/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

const optionSchema = Type.Object(
	{
		files: Type.Optional(Type.Array(Type.String())),
		ignorePackages: Type.Optional(Type.Boolean()),
		relativeModulePrefixes: Type.Optional(Type.Array(Type.String())),
		expectedExtensions: Type.Optional(Type.Array(Type.String())),
		disallowedExtensions: Type.Optional(Type.Array(Type.String())),
	},
	{ additionalProperties: false },
)

export const extensionsArgSchema = Type.Array(optionSchema)

export type ExtensionsOptions = Static<typeof optionSchema>
export type ExtensionsArguments = Static<typeof extensionsArgSchema>
