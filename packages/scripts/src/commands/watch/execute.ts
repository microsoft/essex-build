/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	RunArg,
	getTsConfigJsonPath,
	getBabelEsmConfigPath,
	getBabelCjsConfigPath,
	getRollupConfigPath,
	runSequential,
	fileExists,
	getWebpackConfigPath,
} from '../../utils'
import { BundleMode } from '../build/execute'

export interface WatchCommandOptions {
	verbose?: boolean
	env?: string
	mode?: BundleMode
}

export async function execute({
	verbose,
	env,
	mode,
}: WatchCommandOptions): Promise<number> {
	const [
		tsConfigJsonPath,
		babelEsmConfigPath,
		babelCjsConfigPath,
		rollupConfigPath,
		webpackConfigPath,
	] = await Promise.all([
		getTsConfigJsonPath(),
		getBabelEsmConfigPath(),
		getBabelCjsConfigPath(),
		getRollupConfigPath(),
		getWebpackConfigPath(),
	])

	const [tsConfigExists, rollupExists, webpackExists] = await Promise.all([
		fileExists(tsConfigJsonPath!),
		fileExists(rollupConfigPath!),
		fileExists(webpackConfigPath!),
	])

	const runs: RunArg[] = []
	// TypeScript Execution
	let babelInputDir = 'lib'
	if (tsConfigExists) {
		runs.push({
			exec: 'tsc',
			args: ['-b', tsConfigJsonPath, '-w', '--preserveWatchOutput'],
		})
	} else {
		if (verbose) {
			console.log('no tsconfig found, skipping tsc watcher')
		}
		babelInputDir = 'src'
	}

	// Babel Down-transpilation
	runs.push(
		{
			exec: 'babel',
			args: [
				`--config-file=${babelEsmConfigPath}`,
				babelInputDir,
				'--ignore="src/**/__tests__/**"',
				'--out-dir',
				'dist/esm',
				'-w',
				verbose ? '--verbose' : undefined,
				env ? `--env-name=${env}` : undefined,
			].filter(t => !!t),
		},
		{
			exec: 'babel',
			args: [
				`--config-file=${babelCjsConfigPath}`,
				babelInputDir,
				'--ignore="src/**/__tests__/**"',
				'--out-dir',
				'dist/cjs',
				'-w',
				verbose ? '--verbose' : undefined,
				env ? `--env-name=${env}` : undefined,
			].filter(t => !!t),
		},
	)

	// Rollup Bundle
	if (rollupExists) {
		runs.push({
			exec: 'rollup',
			args: ['-c', rollupConfigPath, '-w'],
		})
	}

	if (webpackExists) {
		runs.push({
			exec: 'webpack',
			args: [
				`--config ${webpackConfigPath}`,
				env ? `--env ${env}` : undefined,
				mode ? `--mode ${mode}` : undefined,
				'-w',
			].filter(t => !!t),
		})
	}

	return runSequential([runs])
}
