/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { run } from '@essex/shellrunner'
import type { Command } from 'commander'
import { eslint } from '../steps/eslint/index.mjs'
import { prettyQuick } from '../steps/pretty-quick/index.mjs'

interface LintCommandOptions {
	fix?: boolean
	staged?: boolean
	docs?: boolean
	strict?: boolean
	docsOnly?: boolean
}

const DEFAULT_FILESET = ['.']

const restricted: Record<string, boolean> = {
	'--fix': true,
	'--staged': true,
	'--strict': true,
}
export default function lint(program: Command): void {
	program
		.command('lint [...files]')
		.description('performs static analysis checks')
		.option('--strict', 'strict linting, warnings will cause failure')
		.option('--fix', 'correct fixable problems')
		.option('--staged', 'only do git-stage verifications')
		.action(async (files: string[], options: LintCommandOptions = {}) => {
			// for some reason CLI arguments were being picked up by the eslint core and throwing errors
			process.argv = [...process.argv.filter(t => !restricted[t])]
			await execute(options, files)
		})
}

async function execute(
	{ fix = false, staged = false, strict = false }: LintCommandOptions,
	files: string[] | undefined,
): Promise<void> {
	files = await getFiles(staged, files)
	const checkCode = eslint(fix, strict, files)
	const checkFormatting = staged
		? prettyQuick({ staged: true })
		: prettyQuick({ check: !fix })

	await Promise.all([checkCode, checkFormatting])
}

async function getFiles(
	staged: boolean,
	filesListed: string[] | undefined,
): Promise<string[]> {
	// lint everything
	if (!filesListed && !staged) {
		return DEFAULT_FILESET
	} else if (staged) {
		return getStagedFiles()
	} else {
		return filesListed ?? DEFAULT_FILESET
	}
}

async function getStagedFiles(): Promise<string[]> {
	const result = await run({
		exec: 'git',
		args: ['--no-pager', 'diff', '--name-only', '--cached'],
		toConsole: false,
	})
	if (result.code !== 0) {
		throw new Error('error listing staged files')
	} else {
		const files = result.output?.split('\n').filter(t => !!t) ?? []
		if (files.length === 0) {
			return DEFAULT_FILESET
		}
		return files.filter(existsSync).filter(isLintable)
	}
}

function isLintable(file: string): boolean {
	return LINTABLE_EXTENSIONS.some(x => file.endsWith(x))
}

const LINTABLE_EXTENSIONS = [
	'.ts',
	'.tsx',
	'.cts',
	'.mts',
	'.js',
	'.jsx',
	'.cjs',
	'.mjs',
]
