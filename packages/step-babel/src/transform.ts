import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { BabelFileResult, transformFile } from '@babel/core'
import { wrapPromiseTask } from '@essex/build-utils'
import { traceFile } from '@essex/tasklogger'
import chalk from 'chalk'

// a cache to prevent excessive repeat stat'ing of directories
const DIRCACHE = new Set<string>()
export const BABEL_GLOB = 'lib/**/*.js'

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

export function createTransformTask(
	title: string,
	root: string,
	babelConfig: any,
	swallowErrors: boolean,
) {
	return wrapPromiseTask(title, swallowErrors, async () => {
		const files = await getSourceFiles()
		await Promise.all(files.map(handleFile))
	})

	async function handleFile(file: string) {
		const result = await transformSourceFile(file, babelConfig)
		if (result?.code) {
			const targetFile = file.replace('lib', root)
			await writeOutputFile(targetFile, result.code)
			if (process.env.ESSEX_DEBUG) {
				traceFile(targetFile, 'babel')
			}
		} else {
			console.warn(chalk.yellow(`no babel compiler output on file ${file}`))
		}
	}
}
