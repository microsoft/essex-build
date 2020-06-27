/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
	log,
	getTsConfigJsonPath,
	getBabelEsmConfigPath,
	getBabelCjsConfigPath,
	getRollupConfigPath,
	getWebpackConfigPath,
} from '../../utils'
import { Job, run } from '@essex/shellrunner'
import { tmpdir } from 'os'
import { exists, writeFileSync, fstat, existsSync } from 'fs'
import { join } from 'path'
import { getWebpackArgs } from '../../utils/webpack'
import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'
import * as dbg from 'gulp-debug'
import * as babel from 'gulp-babel'
import * as through2 from 'through2'
import { streamToPromise } from '../../utils/streamToPromise'

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

const fileExists = (file: string): Promise<boolean> =>
	new Promise(resolve => exists(file, is => resolve(is)))

export async function execute(config: BuildCommandOptions): Promise<number> {
	const { verbose, env } = config
	const tsConfigFile = join(process.cwd(), 'tsconfig.json')
	if (!existsSync(tsConfigFile)) {
		log.error('tsconfig.json must exist in source folder')
		return 1
	}
	const tsProject = ts.createProject(tsConfigFile)
	const stream = gulp
		.src(['src/**/*.ts', '!**/__tests__/**'])
		.pipe(tsProject())
		.pipe(verbose ? dbg({ title: 'tsc' }) : through2.obj())
		.pipe(gulp.dest('lib'))
	return streamToPromise(stream).then(
		() => 0,
		() => 1,
	)
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
	// 				'--ignore="src/**/__tests__/**"',
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
	// 				'--ignore="src/**/__tests__/**"',
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

	// async function getDocumentationJob(
	// 	pkgJson: any,
	// 	tsConfigJsonPath: string,
	// ): Promise<[Job, string]> {
	// 	const { name, title } = pkgJson
	// 	const readmePath = join(process.cwd(), 'README.md')
	// 	const readmeExists = await fileExists(readmePath)

	// 	// Write out a temp file containing a tsconfig with types stripped
	// 	const uniquePkgId = name
	// 		.replace(/\@/g, '')
	// 		.replace(/\//g, '__')
	// 		.replace(/\./g, '_')
	// 	const docsTsConfigJson = join(tmpdir(), `tsconfig.${uniquePkgId}.docs.json`)
	// 	const tsConfigContent = {
	// 		extends: tsConfigJsonPath,
	// 		compilerOptions: { stripInternal: true },
	// 	}
	// 	debugLog('typedoc tsconfig: ', tsConfigContent)
	// 	writeFileSync(docsTsConfigJson, JSON.stringify(tsConfigContent, null, 4))

	// 	return [
	// 		{
	// 			// API Documentation
	// 			exec: 'typedoc',
	// 			args: [
	// 				'--name',
	// 				title || name || 'API Documentation',
	// 				...(readmeExists ? ['--readme', readmePath] : []),
	// 				'--excludeExternals',
	// 				'--excludeNotExported',
	// 				'--exclude',
	// 				'**/__tests__/**',
	// 				'--exclude',
	// 				'**/node_modules/**',
	// 				'--out',
	// 				'./dist/docs',
	// 				'--tsconfig',
	// 				docsTsConfigJson,
	// 				'.',
	// 			],
	// 		},
	// 		docsTsConfigJson,
	// 	]
}
