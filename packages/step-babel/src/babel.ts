/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { BabelFileResult, transformFile } from '@babel/core'
import fs, { FSWatcher } from 'fs'
import path from 'path'
import glob from 'glob'
import gulp from 'gulp'
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import { subtaskSuccess, subtaskFail, printPerf } from '@essex/tasklogger'
import { performance } from 'perf_hooks'

const BABEL_GLOB = 'lib/**/*.js'

function createErrorHandler(title: string, listen: boolean) {
	return function onError(err?: Error | undefined) {
		console.error('Babel Error', err)
		if (listen) {
			subtaskFail(title, err)
			throw new Error(`babel transpile error`)
		}
	}
}

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
function babelCjs(env: string): gulp.TaskFunction {
	const root = path.join(process.cwd(), 'dist/cjs')
	return createTransformTask('babel-cjs', root, getCjsConfiguration(env))
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
function babelEsm(env: string): gulp.TaskFunction {
	const root = path.join(process.cwd(), 'dist/esm')
	return createTransformTask('babel-esm', root, getEsmConfiguration(env))
}

function babelTasks(env: string) {
	return gulp.parallel(babelEsm(env), babelCjs(env))
}

/**
 * Transpiles babel from lib/ into dist/esm and dist/cjs
 * @param env
 * @param listen
 */
export function buildBabel(env: string): gulp.TaskFunction {
	return babelTasks(env)
}

/**
 * Watches typescript from src/ to the lib/ folder
 * @param verbose verbose mode
 */
export function watchBabel(env: string): FSWatcher {
	return gulp.watch([BABEL_GLOB], babelTasks(env))
}

function getSourceFiles(): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) =>
		glob(BABEL_GLOB, (err, files) => {
			if (err) {
				reject(err)
			} else {
				resolve(files)
			}
		}),
	)
}

async function transformSourceFile(
	file: string,
	babelConfig: any,
): Promise<BabelFileResult | null> {
	return new Promise<BabelFileResult | null>((resolve, reject) => {
		transformFile(file, babelConfig, (err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

function writeOutputFile(file: string, content: string): void {
	const fileDir = path.dirname(file)
	if (!fs.existsSync(fileDir)) {
		fs.mkdirSync(fileDir, { recursive: true })
	}
	fs.writeFileSync(file, content, {
		encoding: 'utf-8',
	})
}

function createTransformTask(title: string, root: string, babelConfig: any) {
	return async function task(): Promise<void> {
		const start = performance.now()
		try {
			const files = await getSourceFiles()
			for (let file of files) {
				const result = await transformSourceFile(file, babelConfig)
				if (result?.code) {
					writeOutputFile(file.replace('lib', root), result.code)
				} else {
					console.warn(`no babel compiler output on file ${file}`)
				}
			}
			const end = performance.now()
			subtaskSuccess(`${title} ${printPerf(start, end)}`)
		} catch (err) {
			const end = performance.now()
			console.error('error transforming babel', err)
			subtaskFail(`${title} ${printPerf(start, end)}`)
		}
	}
}
