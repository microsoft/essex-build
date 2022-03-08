/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import type { TypeDocOptions } from 'typedoc'
import { Application, TSConfigReader, TypeDocReader } from 'typedoc'

import { readTargetPackageJson } from '../../util/package.mjs'
import {
	printPerf,
	subtaskFail,
	subtaskSuccess,
} from '../../util/tasklogger.mjs'

const readmePath = join(process.cwd(), 'README.md')
const DEFAULT_ENTRY_POINT = [
	'src/index.ts',
	'src/index.tsx',
	'src/index.mts',
	'src/index.cts',
]

/**
 * Generates API documentation using TypeDoc
 */
export async function generateTypedocs(): Promise<void> {
	try {
		const { title, name } = await readTargetPackageJson()
		return typedoc({
			name: title || name || 'API Documentation',
			entryPoints: DEFAULT_ENTRY_POINT,
			excludeInternal: true,
			excludeExternals: true,
			excludeProtected: true,
			exclude: ['**/__tests__/**', '**/node_modules/**'],
			excludePrivate: true,
			tsconfig: join(process.cwd(), 'tsconfig.json'),
			out: 'dist/docs',
			logger: 'none',
			readme: existsSync(readmePath) ? readmePath : (undefined as any),
		})
	} catch (err) {
		console.log('error running typedoc', err)
		return Promise.reject(err)
	}
}

/**
 * Generate TypeDoc documentation
 * @param options TypeDoc options
 */
async function typedoc(options: Partial<TypeDocOptions>): Promise<void> {
	const start = performance.now()
	return new Promise((resolve, reject) => {
		try {
			const app = new Application()
			app.options.addReader(new TSConfigReader())
			app.options.addReader(new TypeDocReader())
			app.bootstrap(options)
			const project = app.convert()
			if (project) {
				app.generateDocs(project, 'dist/docs')
				subtaskSuccess('typedoc', printPerf(start))
				resolve()
			} else {
				reject(new Error('could not create TypeDoc project'))
			}
		} catch (err) {
			console.error('typedoc error', err)
			subtaskFail('typedoc')
			reject(err)
		}
	})
}
