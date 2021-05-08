/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import fs, { FSWatcher } from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'
import chalk from 'chalk'
import { BabelFileResult, transformFile } from '@babel/core'
import glob from 'glob'
import gulp from 'gulp'
import { getCjsConfiguration, getEsmConfiguration } from '@essex/babel-config'
import {
	subtaskSuccess,
	subtaskFail,
	printPerf,
	info,
	timestamp,
} from '@essex/tasklogger'

const BABEL_GLOB = 'lib/**/*.js'
// a cache to prevent excessive repeat stat'ing of directories
const DIRCACHE = new Set<string>()

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
function babelCjs(env: string): gulp.TaskFunction {
	const root = 'dist/cjs'
	return createTransformTask('babel-cjs', root, getCjsConfiguration(env))
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
function babelEsm(env: string): gulp.TaskFunction {
	const root = 'dist/esm'
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
			console.log('FILES', files)
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

async function writeOutputFile(file: string, content: string): Promise<void> {
	await ensureFilePath(file)
	return new Promise((resolve, reject) => {
		fs.writeFile(
			file,
			content,
			{
				encoding: 'utf-8',
			},
			err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			},
		)
	})
}

async function ensureFilePath(file: string): Promise<void> {
	const fileDir = path.dirname(file)
	const exists = await dirExists(fileDir)
	if (!exists) {
		return createDir(fileDir)
	}

	function dirExists(dir: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (DIRCACHE.has(dir)) {
				resolve(true)
			} else {
				fs.stat(dir, (err, stat) => {
					if (err) {
						if (err.code === 'ENOENT') {
							resolve(false)
						} else {
							console.log('ERR', err.errno, err.code)
							reject(err)
						}
					} else {
						resolve(true)
						DIRCACHE.add(dir)
					}
				})
			}
		})
	}

	function createDir(dir: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(dir, { recursive: true }, err => {
				if (err) {
					reject(err)
				} else {
					DIRCACHE.add(dir)
					resolve()
				}
			})
		})
	}
}

function createTransformTask(title: string, root: string, babelConfig: any) {
	return async function task(): Promise<void> {
		const start = performance.now()
		try {
			const files = await getSourceFiles()
			await Promise.all(files.map(handleFile))
			const end = performance.now()
			subtaskSuccess(`${title} ${printPerf(start, end)}`)
		} catch (err) {
			const end = performance.now()
			console.error('error transforming babel', err)
			subtaskFail(`${title} ${printPerf(start, end)}`)
		}
	}

	async function handleFile(file: string) {
		const result = await transformSourceFile(file, babelConfig)
		if (result?.code) {
			const targetFile = file.replace('lib', root)
			await writeOutputFile(targetFile, result.code)
			if (process.env.ESSEX_DEBUG) {
				const now = new Date()
				info(
					`[${chalk.grey(timestamp())}] babel ${chalk.blueBright(targetFile)}`,
				)
			}
		} else {
			console.warn(chalk.yellow(`no babel compiler output on file ${file}`))
		}
	}
}
