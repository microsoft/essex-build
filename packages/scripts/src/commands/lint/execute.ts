/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { Job, run } from '@essex/shellrunner'
import { prettyQuick } from '@essex/build-step-pretty-quick'
import { eslint } from '@essex/build-step-eslint'
import { docs as checkDocs } from '@essex/build-step-docs'
import { subtaskSuccess, subtaskFail } from '../../utils/log'

export interface LintCommandOptions {
	fix?: boolean
	staged?: boolean
	docs?: boolean
	strict?: boolean
	spellingIgnore?: string
}

export async function execute({
	fix = false,
	staged = false,
	docs = false,
	strict = false,
	spellingIgnore,
}: LintCommandOptions): Promise<number> {
	try {
		const eslintTask = eslint(fix, strict).then(
			() => subtaskSuccess('eslint'),
			() => subtaskFail('eslint'),
		)
		const prettierTask = (staged
			? prettyQuick({ staged: true })
			: prettyQuick({ check: !fix })
		).then(
			() => subtaskSuccess('pretty-quick'),
			() => subtaskFail('pretty-quick'),
		)

		const tonalLintingJob = docs
			? checkDocs().then(
					() => subtaskSuccess('docs'),
					() => subtaskFail('docs'),
			  )
			: Promise.resolve()

		await Promise.all([eslintTask, prettierTask, tonalLintingJob])
		return 0
	} catch (err) {
		console.error(err)
		return 1
	}
}