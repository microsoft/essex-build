/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getSwcOptions } from '@essex/swc-opts'
import * as swc from '@swc/core'
import fs from 'fs/promises'
import path from 'path'
import { performance } from 'perf_hooks'

import { noop } from '../../util/noop.mjs'
import { printPerf, subtaskSuccess, traceFile } from '../../util/tasklogger.mjs'

const ESM_ONLY_PATH = 'dist/'
const ESM_PATH = 'dist/esm'
const CJS_PATH = 'dist/cjs'

export async function compile(
	fileNames: string[],
	logFiles: boolean,
	esmOnly: boolean,
): Promise<void> {
	const start = performance.now()
	await createOutputFolders(esmOnly)
	await Promise.all(fileNames.map((f) => transpileFile(f, logFiles, esmOnly)))
	subtaskSuccess('transpile', printPerf(start))
}

function createOutputFolders(esmOnly: boolean) {
	if (esmOnly) {
		return fs.mkdir(ESM_ONLY_PATH, { recursive: true })
	} else {
		return Promise.all([
			fs.mkdir(ESM_PATH, { recursive: true }),
			fs.mkdir(CJS_PATH, { recursive: true }),
		])
	}
}

async function transpileFile(
	filename: string,
	logFiles: boolean,
	esmOnly: boolean,
) {
	const esmOutputPath = path.dirname(filename).replace(/^src/, ESM_PATH)
	const cjsOutputPath = path.dirname(filename).replace(/^src/, CJS_PATH)

	if (logFiles) {
		traceFile(`${filename}`, 'transpile')
	}

	const options = getSwcOptions()
	const code = await fs.readFile(filename, { encoding: 'utf8' })
	const esmResult = writeOutput(
		code,
		filename,
		esmOnly ? ESM_ONLY_PATH : ESM_PATH,
		{
			...options,
			filename,
			isModule: true,
			outputPath: esmOutputPath,
			module: {
				...(options.module || {}),
				type: 'es6',
			},
		},
	)

	const cjsResult = esmOnly
		? noop
		: writeOutput(code, filename, CJS_PATH, {
				...options,
				filename,

				isModule: true,
				outputPath: cjsOutputPath,
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
		const outputFile = path
			.join(outputRoot, filename.replace(/^src/, ''))
			.replace(/\.tsx?$/, '.js')
		const mapFile = `${outputFile}.map`
		const outputDir = path.dirname(outputFile)

		await fs.mkdir(outputDir, { recursive: true })
		await Promise.all([
			fs.writeFile(outputFile, code, { encoding: 'utf8' }),
			map ? fs.writeFile(mapFile, map, { encoding: 'utf8' }) : null,
		])
	})
}
