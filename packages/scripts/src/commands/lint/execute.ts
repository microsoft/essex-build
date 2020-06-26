/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RunArg, runParallel } from '@essex/shellrunner'
import { getEslintJob } from './getEslintJob'

export interface LintCommandOptions {
	fix?: boolean
	staged?: boolean
	docs?: boolean
	strict?: boolean
	spellingIgnore?: string
}

const PRETTY_QUICK_JOB: RunArg = {
	exec: 'pretty-quick',
	args: ['--check'],
}

const TONAL_LINTING_JOB: RunArg = {
	exec: 'alex',
	args: ['.'],
}

const SPELL_CHECK_JOB = (spellingIgnore: string | undefined): RunArg => {
	const args = [
		'--report',
		'--en-us',
		'--no-suggestions',
		'--ignore-acronyms',
		'--ignore-numbers',
		'**/*.md',
		'!**/node_modules/**/*.md',
		'!CHANGELOG.md',
	]
	if (spellingIgnore != null) {
		args.push(`!${spellingIgnore}`)
	}
	return {
		exec: 'mdspell',
		args,
	}
}

export async function execute({
	fix = false,
	staged = false,
	docs = false,
	strict = false,
	spellingIgnore,
}: LintCommandOptions): Promise<number> {
	const eslint = await getEslintJob(fix, strict)

	const toRun: RunArg[] = [eslint]
	if (!staged) {
		toRun.push(PRETTY_QUICK_JOB)
		if (docs) {
			toRun.push(TONAL_LINTING_JOB, SPELL_CHECK_JOB(spellingIgnore))
		}
	}
	return runParallel(...toRun)
}
