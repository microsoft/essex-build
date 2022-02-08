/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import {
	Application,
	TSConfigReader,
	TypeDocReader,
	TypeDocOptions,
} from 'typedoc'
import { printPerf, subtaskFail, subtaskSuccess } from '../../util/tasklogger'

const packageJsonPath = join(process.cwd(), 'package.json')
const readmePath = join(process.cwd(), 'README.md')
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const packageJson = require(packageJsonPath)
const DEFAULT_ENTRY_POINT = 'src/index.ts'

/**
 * Generates API documentation using TypeDoc
 */
export function generateTypedocs(): Promise<void> {
	try {
		const { title, name } = packageJson
		return typedoc({
			name: title || name || 'API Documentation',
			entryPoints: [DEFAULT_ENTRY_POINT],
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
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			app.generateDocs(project!, 'dist/docs')
			subtaskSuccess('typedoc', printPerf(start))
			resolve()
		} catch (err) {
			subtaskFail('typedoc')
			reject(err)
		}
	})
}
