/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { ApiDocumenterCommandLine } from '@microsoft/api-documenter/lib/cli/ApiDocumenterCommandLine.js'
import type { ExtractorResult, IConfigFile } from '@microsoft/api-extractor'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { existsSync, promises as fs } from 'fs'
import { createRequire } from 'module'
import { dirname, resolve } from 'path'

import { fixLineEndings } from '../../util/fixLineEndings.js'
import { readPublishedPackageJson } from '../../util/package.mjs'
import { rm } from '../rm.js'

const require = createRequire(import.meta.url)

const localPackageJsonPath = resolve(process.cwd(), 'package.json')
const defaultApiExtractorConfigPath: string = require.resolve(
	'@essex/api-extractor-config/api-extractor.json',
)
const localApiExtractorConfigPath: string = resolve(
	process.cwd(),
	'api-extractor.json',
)
const isLocalConfig = existsSync(localApiExtractorConfigPath)

const apiExtractorPath: string = isLocalConfig
	? localApiExtractorConfigPath
	: defaultApiExtractorConfigPath

/**
 * Generates API documentation using [api-extractor](https://api-extractor.com/)
 */
export async function generateApiExtractorReport(): Promise<void> {
	await Promise.all([rm('docs'), rm('docsTemp')])
	await runExtractor()
	await runDocumenter()
	await Promise.all([rm('docsTemp'), fixLineEndings('docs/**/*.md')])
}

async function runExtractor() {
	const configFile: IConfigFile = ExtractorConfig.loadFile(apiExtractorPath)

	if (!isLocalConfig) {
		configFile.projectFolder = process.cwd()

		const targetPkg = await readPublishedPackageJson()
		if (!targetPkg.type || targetPkg.type !== 'module') {
			configFile.mainEntryPointFilePath =
				'<projectFolder>/dist/types/index.d.ts'
		}
	}

	const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
		configObject: configFile,
		ignoreMissingEntryPoint: true,
		configObjectFullPath: process.cwd(),
		packageJsonFullPath: localPackageJsonPath,
	})

	await fs.mkdir(dirname(extractorConfig.reportFilePath), { recursive: true })

	const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
		localBuild: true,
	})

	if (extractorResult.succeeded) {
		console.log('API Extractor completed successfully')
		if (extractorResult.apiReportChanged) {
			console.warn(
				`Public API has changed. New API report in ${extractorConfig.reportFilePath}.`,
			)
		}
	} else {
		console.error(
			`API Extractor completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`,
		)
	}
}

function runDocumenter(): Promise<boolean> {
	return new ApiDocumenterCommandLine().execute([
		'markdown',
		'-i',
		'docs/report',
		'-o',
		'docs/markdown',
	])
}
