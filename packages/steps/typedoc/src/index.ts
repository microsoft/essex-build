/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { gulpify } from '@essex/build-utils'
import {
	Application,
	TSConfigReader,
	TypeDocReader,
	TypeDocAndTSOptions,
} from 'typedoc'

const packageJsonPath = join(process.cwd(), 'package.json')
const readmePath = join(process.cwd(), 'README.md')
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const packageJson = require(packageJsonPath)
const DEFAULT_ENTRY_POINT = 'src/index.ts'

/**
 * Generates API documentation using TypeDoc
 */
export function generateTypedocs(verbose: boolean): Promise<void> {
	try {
		const { title, name } = packageJson
		return typedoc({
			name: title || name || 'API Documentation',
			entryPoint: DEFAULT_ENTRY_POINT,
			stripInternal: true,
			excludeExternals: true,
			excludeNotExported: true,
			exclude: ['**/__tests__/**', '**/node_modules/**'],
			excludePrivate: true,
			project: 'tsconfig.json',
			out: 'dist/docs',
			logger: 'none',
			readme: existsSync(readmePath) ? readmePath : undefined,
		})
	} catch (err) {
		console.log('error running typedoc', err)
		return Promise.reject(err)
	}
}

export const generateTypedocsGulp = gulpify('typedocs', generateTypedocs)

/**
 * Generate TypeDoc documentation
 * @param options TypeDoc options
 */
async function typedoc(options: Partial<TypeDocAndTSOptions>): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const app = new Application()
			app.options.addReader(new TSConfigReader())
			app.options.addReader(new TypeDocReader())
			app.bootstrap(options)
			const src = app.expandInputFiles([DEFAULT_ENTRY_POINT])
			app.generateDocs(src, 'dist/docs')
			resolve()
		} catch (err) {
			reject(err)
		}
	})
}
