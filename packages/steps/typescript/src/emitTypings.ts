/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { tsJob } from './tsJob'

/**
 * Emits typings files into dist/types
 * @param configFile The tsconfig.json path
 * @param verbose verbose mode
 */
export function emitTypings(
	configFile: string,
	debug: boolean,
): () => NodeJS.ReadWriteStream {
	return tsJob({
		configFile,
		debug,
		dest: 'dist/types',
		title: 'typings',
		overrides: {
			declaration: true,
			emitDeclarationOnly: true,
			stripInternal: true,
		},
	})
}
