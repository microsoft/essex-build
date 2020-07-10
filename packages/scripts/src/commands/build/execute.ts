/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { existsSync } from 'fs'
import { join, resolve } from 'path'
import { Job, run } from '@essex/shellrunner'
import { babelEsm, babelCjs } from '@essex/build-step-babel'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { fail } from '../../utils/log'
import { resolveTask } from '../../utils'
import { configureTasks } from './tasks'
import { BundleMode, BuildCommandOptions } from './types'

// const cwd = process.cwd()
// const tsConfigJsonPath = join(cwd, 'tsconfig.json')
// const rollupConfig = join(cwd, 'rollup.config.js')
// const webpackConfig = join(cwd, 'webpack.config.js')

export async function execute(options: BuildCommandOptions): Promise<number> {
	try {
		const build = configureTasks(options)
		build((err?: Error) => {
			if (err) {
				fail('build error', err)
				return 1
			}
			return 0
		})
		return 0
	} catch (err) {
		fail('build error', err)
		return 1
	}
}

// function executeTypeScriptJobs(verbose: boolean, docs: boolean): Promise<any> {
// 	return Promise.all([
// 		compileTypescript(tsConfigJsonPath, verbose).then(...resolveTask('tsc')),
// 		emitTypings(tsConfigJsonPath, verbose).then(...resolveTask('typings')),
// 		docs
// 			? generateTypedocs(verbose).then(...resolveTask('typedoc'))
// 			: Promise.resolve(),
// 	])
// }

// async function executeBabelJobs(verbose: boolean): Promise<any> {
// 	try {
// 		const cjsJob = babelCjs(verbose).then(...resolveTask('babel-cjs'))
// 		const esmJob = babelEsm(verbose).then(...resolveTask('babel-esm'))
// 		return await Promise.all([cjsJob, esmJob])
// 	} catch (err) {
// 		return Promise.reject(err)
// 	}
// }

// function executeBundleJobs(verbose: boolean, env: string, mode: string) {
// 	const promises: Promise[] = []

// 	// if (existsSync(rollupConfig)) {
// 	// 	promises.push({
// 	// 		exec: 'rollup',
// 	// 		args: ['-c', rollupConfig],
// 	// 	})
// 	// }
// 	if (existsSync(webpackConfig)) {
// 		promises.push(webpackBuild({ env, mode, verbose }))
// 	}

// 	return Promise.all([promises])
// }
