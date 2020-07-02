/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { Job, run } from '@essex/shellrunner'
import { resolveTask } from '../../utils'
import { docs as checkDocs } from '@essex/build-step-docs'
import { eslint } from '@essex/build-step-eslint'
import { prettyQuick } from '@essex/build-step-pretty-quick'

export interface LintCommandOptions {
	fix?: boolean
	staged?: boolean
	docs?: boolean
	strict?: boolean
}

export async function execute({
	fix = false,
	staged = false,
	docs = false,
	strict = false,
}: LintCommandOptions): Promise<number> {
	try {
		const eslintTask = eslint(fix, strict).then(...resolveTask('eslint'))
		const prettierTask = (staged
			? prettyQuick({ staged: true })
			: prettyQuick({ check: !fix })
		).then(...resolveTask('pretty-quick'))

		const checkDocsTask = docs
			? checkDocs().then(...resolveTask('check docs'))
			: Promise.resolve()

		await Promise.all([eslintTask, prettierTask, checkDocsTask])
		return 0
	} catch (err) {
		console.error(err)
		return 1
	}
}
