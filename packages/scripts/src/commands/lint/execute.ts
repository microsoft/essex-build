/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { Job, run } from '@essex/shellrunner'
import { prettyQuick } from '@essex/build-step-pretty-quick'
import { eslint } from '@essex/build-step-eslint'
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
		const prettierTask = staged
			? prettyQuick({ staged: true })
			: prettyQuick({ check: !fix })

		// const toRun: Job[] = [eslint]
		// if (!staged) {
		// 	toRun.push(PRETTY_QUICK_JOB)
		// 	if (docs) {
		// 		toRun.push(TONAL_LINTING_JOB, SPELL_CHECK_JOB(spellingIgnore))
		// 	}
		// }
		// const { code } = await run(...toRun)

		await Promise.all([
			eslint(fix, strict).then(
				() => subtaskSuccess('eslint'),
				() => subtaskFail('eslint'),
			),
			prettierTask.then(
				() => subtaskSuccess('pretty-quick'),
				() => subtaskFail('pretty-quick'),
			),
		])
		return 0
	} catch (err) {
		console.error(err)
		return 1
	}
}

// const PRETTY_QUICK_JOB: any = {
// 	exec: 'pretty-quick',
// 	args: ['--check'],
// }

// const TONAL_LINTING_JOB: any = {
// 	exec: 'alex',
// 	args: ['.'],
// }

// const SPELL_CHECK_JOB = (spellingIgnore: string | undefined): any => {
// 	const args = [
// 		'--report',
// 		'--en-us',
// 		'--no-suggestions',
// 		'--ignore-acronyms',
// 		'--ignore-numbers',
// 		'**/*.md',
// 		'!**/node_modules/**/*.md',
// 		'!CHANGELOG.md',
// 	]
// 	if (spellingIgnore != null) {
// 		args.push(`!${spellingIgnore}`)
// 	}
// 	return {
// 		exec: 'mdspell',
// 		args,
// 	}
// }
