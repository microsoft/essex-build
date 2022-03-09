/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/unbound-method */
import { load } from 'tsconfig'
import ts from 'typescript'

const BASIC_HOST: ts.ParseConfigHost = {
	useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
	fileExists: ts.sys.fileExists,
	readFile: ts.sys.readFile,
	readDirectory: ts.sys.readDirectory,
}

export type TSConfigData = unknown
export async function loadTSConfig(): Promise<TSConfigData> {
	const result = await load(process.cwd())
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-return */
	return result.config as TSConfigData
}

export function parseTSConfig(config: any): ts.CompilerOptions {
	const result = ts.parseJsonConfigFileContent(
		config,
		BASIC_HOST,
		process.cwd(),
	)
	return result.options
}
