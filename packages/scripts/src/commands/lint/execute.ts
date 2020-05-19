/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RunArg, runParallel } from '../../utils'
import { getEslintJob } from './getEslintJob'

export interface LintCommandOptions {
	fix?: boolean
	staged?: boolean
	docs?: boolean
	strict?: boolean
}

const jobs: Record<string, RunArg> = {
	prettyQuick: {
		exec: 'pretty-quick',
		args: ['--check'],
	},
	tonalCheck: {
		exec: 'alex',
		args: ['.'],
	},
	spellCheck: {
		exec: 'mdspell',
		args: [
			'--report',
			'--en-us',
			'--no-suggestions',
			'--ignore-acronyms',
			'--ignore-numbers',
			'**/*.md',
			'!**/node_modules/**/*.md',
		],
	},
}

export async function execute({
	fix = false,
	staged = false,
	docs = false,
	strict = false,
}: LintCommandOptions): Promise<number> {
	const eslint = await getEslintJob(fix, strict)

	const toRun: RunArg[] = [eslint]
	if (!staged) {
		toRun.push(jobs.prettyQuick)
		if (docs) {
			toRun.push(jobs.tonalCheck, jobs.spellCheck)
		}
	}
	return runParallel(...toRun)
}
