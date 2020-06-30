/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
	getTsConfigJsonPath,
	getBabelEsmConfigPath,
	getBabelCjsConfigPath,
	getRollupConfigPath,
	getWebpackConfigPath,
} from '../../utils'
import { babelEsm, babelCjs } from '@essex/build-step-babel'
import { compileTypescript, emitTypings } from '@essex/build-step-typescript'
import { generateTypedocs } from '@essex/build-step-typedoc'
import { subtaskSuccess, subtaskFail } from '../../utils/log'
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

/*
 * A:                          B: typedoc
 * - [tsc, tsc types ]
 * - [babel-esm, babel-cjs]
 * - [rollup, webpack]
 */

export async function execute(config: BuildCommandOptions): Promise<number> {
	const { verbose = false, env, docs, mode } = config
	const tsConfigJsonPath = await getTsConfigJsonPath()

	try {
		await Promise.all([
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

		await Promise.all([
			babelCjs(verbose).then(
				() => subtaskSuccess('babel-cjs'),
				() => subtaskFail('babel-cjs'),
			),
			babelEsm(verbose).then(
				() => subtaskSuccess('babel-esm'),
				() => subtaskFail('babel-esm'),
			),
		])

		return 0
	} catch (err) {
		console.error('error running build', err)
		return 1
	}
}

/*

	// 	const [
	// 		tsConfigJsonPath,
	// 		babelEsmConfigPath,
	// 		babelCjsConfigPath,
	// 		rollupConfigPath,
	// 		webpackConfigPath,
	// 	] = await Promise.all([
	// 		getTsConfigJsonPath(),
	// 		getBabelEsmConfigPath(),
	// 		getBabelCjsConfigPath(),
	// 		getRollupConfigPath(),
	// 		getWebpackConfigPath(),
	// 	])

	// 	const pkgJson = require(join(process.cwd(), 'package.json'))
	// 	const [tsConfigExists, rollupExists, webpackExists] = await Promise.all([
	// 		fileExists(tsConfigJsonPath!),
	// 		fileExists(rollupConfigPath!),
	// 		fileExists(webpackConfigPath!),
	// 	])

	// 	const runs: Array<Job | Job[]> = []
	// 	let runTypedoc: Job | undefined
	// 	let typedocTsConfigPath: string | undefined
	// 	if (tsConfigExists && config.docs) {
	// 		const [job, path] = await getDocumentationJob(pkgJson, tsConfigJsonPath)
	// 		runTypedoc = job
	// 		typedocTsConfigPath = path
	// 	}

	// 	let babelInputDir = 'lib'
	// 	if (tsConfigExists) {
	// 		if (verbose) {
	// 			log.info(`generating ts output using [${tsConfigJsonPath}]`)
	// 		}
	// 		runs.push([
	// 			{
	// 				// TypeScript Execution
	// 				exec: 'tsc',
	// 				args: [],
	// 			},
	// 			{
	// 				// TypeScript Type Emission (strips internally marked fields)
	// 				exec: 'tsc',
	// 				args: [
	// 					'--stripInternal',
	// 					'--emitDeclarationOnly',
	// 					'--outDir',
	// 					'./dist/types',
	// 				],
	// 			},
	// 		])
	// 	} else {
	// 		babelInputDir = 'src'
	// 	}

	// 	// Babel Down-transpilation
	// 	if (verbose) {
	// 		log.info(`generating babel esm output using [${babelEsmConfigPath}]`)
	// 		log.info(`generating babel cjs output using [${babelCjsConfigPath}]`)
	// 	}
	// 	runs.push([
	// 		{
	// 			exec: 'babel',
	// 			args: [
	// 				`--config-file=${babelEsmConfigPath}`,
	// 				babelInputDir,
	// 				'--ignore="src/* * /__tests__/**"',
	// 				'--out-dir',
	// 				'dist/esm',
	// 				verbose ? '--verbose' : undefined,
	// 				env ? `--env-name=${env}` : undefined,
	// 			].filter(t => !!t),
	// 		},
	// 		{
	// 			exec: 'babel',
	// 			args: [
	// 				`--config-file=${babelCjsConfigPath}`,
	// 				babelInputDir,
	// 				'--ignore="src/* * / __tests__/ **"',
	// 				'--out-dir',
	// 				'dist/cjs',
	// 				verbose ? '--verbose' : undefined,
	// 				env ? `--env-name=${env}` : undefined,
	// 			].filter(t => !!t),
	// 		},
	// 	])

	// 	// Add bundle actions in parallel
	// 	const bundleActions: Job[] = []

	// 	// Rollup Bundle
	// 	if (rollupExists) {
	// 		bundleActions.push({
	// 			exec: 'rollup',
	// 			args: ['-c', rollupConfigPath],
	// 		})
	// 	}
	// 	if (webpackExists) {
	// 		bundleActions.push({
	// 			exec: 'webpack',
	// 			args: getWebpackArgs(webpackConfigPath, config),
	// 		})
	// 	}

	// 	if (bundleActions.length > 0) {
	// 		runs.push(bundleActions)
	// 	}

	// 	if (runTypedoc) {
	// 		// typedoc can be run in parallel to tsc+babel sequence
	// 		return Promise.all([run(...runs), run(runTypedoc)]).then(([a, b]) => {
	// 			// when typedoc is finished, clean up the temp file
	// 			return run({
	// 				exec: 'rimraf',
	// 				args: [typedocTsConfigPath],
	// 			}).then(c => Math.max(a.code, b.code, c.code))
	// 		})
	// 	} else {
	// 		const { code } = await run(...runs)
	// 		return code
	// 	}
	// }
*/
