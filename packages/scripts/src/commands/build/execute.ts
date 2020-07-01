/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { Job, run } from '@essex/shellrunner'
import { babelEsm, babelCjs } from '@essex/build-step-babel'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { subtaskSuccess, subtaskFail } from '../../utils/log'
import { getWebpackArgs } from '../../utils/webpack'

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

export function execute({
	verbose = false,
	env = 'production',
	docs = false,
	mode = BundleMode.production,
}: BuildCommandOptions): Promise<number> {
	return executeTypeScriptJobs(verbose, docs)
		.then(() => executeBabelJobs(verbose))
		.then(() => executeBundleJobs(verbose, env, mode))
		.then(() => 0)
		.catch(() => 1)
}

function executeTypeScriptJobs(verbose: boolean, docs: boolean): Promise<any> {
	const tsConfigJsonPath = join(process.cwd(), 'tsconfig.json')
	return Promise.all([
		compileTypescript(tsConfigJsonPath, verbose).then(
			() => subtaskSuccess('tsc'),
			() => subtaskFail('tsc'),
		),
		emitTypings(tsConfigJsonPath, verbose).then(
			() => subtaskSuccess('typings'),
			() => subtaskFail('typings'),
		),
		docs
			? generateTypedocs(verbose).then(
					() => subtaskSuccess('typedoc'),
					() => subtaskFail('typedoc'),
			  )
			: Promise.resolve(),
	])
}

function executeBabelJobs(verbose: boolean): Promise<any> {
	return Promise.all([
		babelCjs(verbose).then(
			() => subtaskSuccess('babel-cjs'),
			() => subtaskFail('babel-cjs'),
		),
		babelEsm(verbose).then(
			() => subtaskSuccess('babel-esm'),
			() => subtaskFail('babel-esm'),
		),
	])
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
