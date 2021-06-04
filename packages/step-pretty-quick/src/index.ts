/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gulpify, wrapPromiseTask } from '@essex/build-utils'
import chalk from 'chalk'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const pq = require('pretty-quick').default

export interface PrettyQuickArgs {
	staged?: boolean
	check?: boolean
	verbose?: boolean
}
export function prettyQuick(args: PrettyQuickArgs): Promise<void> {
	try {
		const prettyQuickResult = pq(process.cwd(), {
			...args,
			onFoundSinceRevision: (scm: string, revision: string) => {
				console.log(
					`🔍  Finding changed files since ${chalk.bold(
						scm,
					)} revision ${chalk.bold(revision)}.`,
				)
			},
			onFoundChangedFiles: (changedFiles: string[]) => {
				console.log(
					`🎯  Found ${chalk.bold(changedFiles.length)} changed ${
						changedFiles.length === 1 ? 'file' : 'files'
					}.`,
				)
			},
			onPartiallyStagedFile: (file: string) => {
				console.log(`✗ Found ${chalk.bold('partially')} staged file ${file}.`)
			},

			onWriteFile: (file: string) => {
				console.log(`✍️  Fixing up ${chalk.bold(file)}.`)
			},

			onCheckFile: (file: string, isFormatted: boolean) => {
				if (!isFormatted) {
					console.log(`⛔️  Check failed: ${chalk.bold(file)}`)
				}
			},

			onExamineFile: (file: string) => {
				console.log(`🔍  Examining ${chalk.bold(file)}.`)
			},
		})

		if (prettyQuickResult.success) {
			console.log('✅  Everything is awesome!')
			return Promise.resolve()
		} else {
			if (prettyQuickResult.errors.indexOf('PARTIALLY_STAGED_FILE') !== -1) {
				console.log(
					'✗ Partially staged files were fixed up.' +
						` ${chalk.bold('Please update stage before committing')}.`,
				)
			}
			if (prettyQuickResult.errors.indexOf('BAIL_ON_WRITE') !== -1) {
				console.log(
					'✗ File had to be prettified and prettyQuick was set to bail mode.',
				)
			}
			if (prettyQuickResult.errors.indexOf('CHECK_FAILED') !== -1) {
				console.log(
					'✗ Code style issues found in the above file(s). Forgot to run Prettier?',
				)
			}
			return Promise.reject(prettyQuickResult.errors)
		}
	} catch (err) {
		console.log('error running pretty-quick', err)
		return Promise.reject(err)
	}
}

export const prettyQuickGulp = gulpify(
	wrapPromiseTask('pretty-quick', false, prettyQuick),
)
