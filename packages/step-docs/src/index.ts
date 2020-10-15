/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { app } from './app'
import { filterShellCode, gulpify } from '@essex/build-utils'

/**
 * Checks docs for tonal linting & misspellings
 */
export function docs(): Promise<void> {
	return app(['.'], {})
		.then(code => ({ code }))
		.then(filterShellCode)
}

export const docsGulp = gulpify('docs', docs)
