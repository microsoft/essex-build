/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync, writeFile } from 'fs'
import * as glob from 'glob'
import { join, dirname } from 'path'
import {
	babelCjs as defaultCjs,
	babelEsm as defaultEsm,
} from './default-config'
import * as mkdirp from 'mkdirp'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { transformFileAsync } = require('@babel/core')

/**
 * Transpile ts output into babel cjs
 * @param verbose
 */
export async function babelCjs(verbose: boolean): Promise<void> {
	const cjsOverridePath = join(process.cwd(), 'babelrc.cjs.js')
	const cjsConfig = existsSync(cjsOverridePath)
		? require(cjsOverridePath)
		: defaultCjs
	return new Promise((resolve, reject) => {
		glob('lib/**/*.js', {}, (err, files) => {
			if (err) {
				reject(err)
			} else {
				resolve(transformFiles(files, cjsConfig, 'cjs'))
			}
		})
	})
}

/**
 * Transpile ts output into babel esm
 * @param verbose
 */
export async function babelEsm(verbose: boolean): Promise<void> {
	const esmOverridePath = join(process.cwd(), 'babelrc.esm.js')
	const esmConfig = existsSync(esmOverridePath)
		? require(esmOverridePath)
		: defaultEsm
	return new Promise((resolve, reject) => {
		glob('lib/**/*.js', {}, (err, files) => {
			if (err) {
				reject(err)
			} else {
				resolve(transformFiles(files, esmConfig, 'esm'))
			}
		})
	})
}

function transformFiles(
	files: string[],
	opts: any,
	dist: string,
): Promise<void> {
	const promises = files.map(file => transformFile(file, opts, dist))
	return Promise.all(promises).then(() => undefined)
}

async function transformFile(
	file: string,
	opts: any,
	dist: string,
): Promise<void> {
	const newFile = file.replace('lib', `dist/${dist}`)
	const result = await transformFileAsync(file, opts)
	await mkdirp(dirname(newFile))
	return new Promise((resolve, reject) => {
		writeFile(newFile, result?.code || 'output error', {}, err => {
			if (err) {
				reject(err)
			}
			resolve()
		})
	})
}
