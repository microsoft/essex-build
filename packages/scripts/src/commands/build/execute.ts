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
import { getWebpackArgs } from '../../utils/webpack'
import { resolveTask } from '../../utils'

export enum BundleMode {
	production = 'production',
	development = 'development',
	none = 'none',
}

export interface BuildCommandOptions {
	verbose?: boolean
	docs?: boolean
	env?: string
	mode?: BundleMode
}

export async function execute({
	verbose = false,
	env = 'production',
	docs = false,
	mode = BundleMode.production,
}: BuildCommandOptions): Promise<number> {
	try {
		await executeTypeScriptJobs(verbose, docs)
		await executeBabelJobs(verbose)
		await executeBundleJobs(verbose, env, mode)
		return 0
	} catch (err) {
		fail('build error', err)
		return 1
	}
}

function executeTypeScriptJobs(verbose: boolean, docs: boolean): Promise<any> {
	const tsConfigJsonPath = join(process.cwd(), 'tsconfig.json')
	return Promise.all([
		compileTypescript(tsConfigJsonPath, verbose).then(...resolveTask('tsc')),
		emitTypings(tsConfigJsonPath, verbose).then(...resolveTask('typings')),
		docs
			? generateTypedocs(verbose).then(...resolveTask('typedoc'))
			: Promise.resolve(),
	])
}

async function executeBabelJobs(verbose: boolean): Promise<any> {
	try {
		const cjsJob = babelCjs(verbose).then(...resolveTask('babel-cjs'))
		const esmJob = babelEsm(verbose).then(...resolveTask('babel-esm'))
		return await Promise.all([cjsJob, esmJob])
	} catch (err) {
		return Promise.reject(err)
	}
}

function executeBundleJobs(verbose: boolean, env: string, mode: string) {
	const rollupConfig = join(process.cwd(), 'rollup.config.js')
	const webpackConfig = join(process.cwd(), 'webpack.config.js')

	const jobs: Job[] = []

	if (existsSync(rollupConfig)) {
		jobs.push({
			exec: 'rollup',
			args: ['-c', rollupConfig],
		})
	}
	if (existsSync(webpackConfig)) {
		jobs.push({
			exec: 'webpack',
			args: getWebpackArgs(webpackConfig, { env, mode, verbose }),
		})
	}

	return run(jobs).then(() => null)
}
