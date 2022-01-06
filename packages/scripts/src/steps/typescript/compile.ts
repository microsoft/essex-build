/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { existsSync, readFileSync } from 'fs'
import fs from 'fs/promises'
import path, { join } from 'path'
import { performance } from 'perf_hooks'
import * as swc from '@swc/core'
import { printPerf, subtaskSuccess, traceFile } from '../../util/tasklogger'

const ESM_PATH = 'dist/esm'
const CJS_PATH = 'dist/cjs'

export async function compile(
	fileNames: string[],
	logFiles: boolean,
): Promise<void> {
	const start = performance.now()
	await createOutputFolders()
	await Promise.all(fileNames.map(f => transpileFile(f, logFiles)))
	subtaskSuccess('transpile', printPerf(start))
}

function createOutputFolders() {
	return Promise.all([
		fs.mkdir(ESM_PATH, { recursive: true }),
		fs.mkdir(CJS_PATH, { recursive: true }),
	])
}

async function transpileFile(filename: string, logFiles: boolean) {
	if (logFiles) {
		traceFile(filename, 'transpile')
	}

	const options = getSwcOptions()
	const code = await fs.readFile(filename, { encoding: 'utf8' })
	const esmResult = writeOutput(code, filename, ESM_PATH, {
		...options,
		filename,
		isModule: true,
		outputPath: path.dirname(filename).replace(/^src/, CJS_PATH),
		module: {
			...(options.module || {}),
			type: 'es6',
		},
	})
	const cjsResult = writeOutput(code, filename, CJS_PATH, {
		...options,
		filename,
		isModule: true,
		outputPath: path.dirname(filename).replace(/^src/, CJS_PATH),
		module: {
			...(options.module || {}),
			type: 'commonjs',
		},
	})
	await Promise.all([esmResult, cjsResult])
}

function writeOutput(
	code: string,
	filename: string,
	outputRoot: string,
	options: swc.Options,
) {
	return swc.transform(code, options).then(async ({ code, map }) => {
		const outputFile = path.join(outputRoot, filename).replace(/\.tsx?$/, '.js')
		const mapFile = `${outputFile}.map`
		const outputDir = path.dirname(outputFile).replace(/^src/, outputRoot)

		await fs.mkdir(outputDir, { recursive: true })
		await Promise.all([
			fs.writeFile(outputFile, code, { encoding: 'utf8' }),
			map ? fs.writeFile(mapFile, map, { encoding: 'utf8' }) : null,
		])
	})
}

const DEFAULT_SWC_CONFIG: swc.Config = {
	sourceMaps: true,
	env: {
		coreJs: '3',
		targets: {
			node: 14,
			browsers: ['>0.5%', 'not IE 11', 'not dead'],
		},
		mode: 'usage',
	},
}

function getSwcOptions() {
	if (existsSync(join(process.cwd(), '.swcrc'))) {
		const swcrc = readFileSync(join(process.cwd(), '.swcrc'), 'utf8')
		const result = JSON.parse(swcrc)
		if (process.env.ESSEX_DEBUG) {
			console.log('using custom swc configuration', result)
		}
		return result
	} else {
		if (process.env.ESSEX_DEBUG) {
			console.log('using default swc configuration')
		}
		return DEFAULT_SWC_CONFIG
	}
}
