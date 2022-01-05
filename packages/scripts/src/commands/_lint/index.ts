/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import { success, fail, printPerf } from '../../util/tasklogger'
import { Command } from 'commander'
import { execute } from './tasks'
import { LintCommandOptions } from './types'

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
			try {
				// for some reason CLI arguments were being picked up by the eslint core and throwing errors
				process.argv = [...process.argv.filter(t => !restricted[t])]
				await execute(options, files)
				success(`lint ${printPerf(0, performance.now())}`)
			} catch (err) {
				console.log('error in lint', err)
				fail(`lint ${printPerf(0, performance.now())}`)
				process.exit(1)
			}
		})
}
