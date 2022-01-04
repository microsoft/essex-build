/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs/promises'
import path from 'path'
import * as swc from '@swc/core'

const ESM_PATH = 'dist/esm'
const CJS_PATH = 'dist/cjs'

const ENV_CONFIG: swc.EnvConfig = {
	coreJs: '3',
	targets: {
		node: 14,
		browsers: ['>0.5%', 'not IE 11', 'not dead'],
	},
	mode: 'usage',
}

export async function compile(fileNames: string[]): Promise<number> {
	await createOutputFolders()
	await Promise.all(fileNames.map(transpileFile))
	return 0
}

function createOutputFolders() {
	return Promise.all([
		fs.mkdir(ESM_PATH, { recursive: true }),
		fs.mkdir(CJS_PATH, { recursive: true }),
	])
}

async function transpileFile(filename: string) {
	const code = await fs.readFile(filename, { encoding: 'utf8' })
	const esmResult = writeOutput(code, filename, ESM_PATH, {
		filename,
		sourceMaps: true,
		isModule: true,
		env: ENV_CONFIG,
		outputPath: path.dirname(filename).replace(/^src/, CJS_PATH),
		module: {
			type: 'es6',
		},
	})
	const cjsResult = writeOutput(code, filename, CJS_PATH, {
		filename,
		sourceMaps: true,
		isModule: true,
		env: ENV_CONFIG,
		outputPath: path.dirname(filename).replace(/^src/, CJS_PATH),
		module: {
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
