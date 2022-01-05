/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { eslint } from '@essex/build-step-eslint'
import { prettyQuick } from '@essex/build-step-pretty-quick'
import { LintCommandOptions } from './types'

export function execute(
	{ fix = false, staged = false, strict = false }: LintCommandOptions,
	files: string[] | undefined,
): Promise<void> {
	const checkCode = eslint(fix, strict, files || ['.'])
	const checkFormatting = staged
		? prettyQuick({ staged: true })
		: prettyQuick({ check: !fix })

	return Promise.all([checkCode, checkFormatting]).then()
}
