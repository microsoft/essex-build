/**
 * JSON schema and TS type definitions for eslint plugin options
 */
import { Static, Type } from '@sinclair/typebox'

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
