/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { run } from '@essex/shellrunner'
import { getProjectPath, log, getEssexScriptsPathSync } from '../../utils'

export interface TestCommandOptions {
	verbose?: boolean
	coverage?: boolean
	watch?: boolean
	ci?: boolean
	clearCache?: boolean
	updateSnapshots?: boolean
	coverageThreshold?: string
	browser?: boolean
	configFile?: string
}

async function getJestConfigFilePath(
	configFileOption: string | undefined,
	verbose: boolean | undefined,
): Promise<string> {
	let jestConfigPath = configFileOption
	if (!jestConfigPath) {
		jestConfigPath = await getProjectPath(
			'jest.config.js',
			getEssexScriptsPathSync('jest.config.js', false)!,
		)
	}
	if (verbose) {
		log.info('using jest config %s', jestConfigPath)
	}
	return jestConfigPath!
}

export async function execute({
	verbose,
	coverage,
	watch,
	ci,
	clearCache,
	coverageThreshold: thresh,
	updateSnapshots,
	browser,
	configFile,
}: TestCommandOptions): Promise<number> {
	configFile = await getJestConfigFilePath(configFile, verbose)
	const args = [
		'-c',
		configFile,
		coverage ? '--coverage' : undefined,
		watch ? '--watch' : undefined,
		ci ? '--ci' : undefined,
		verbose ? '--verbose' : undefined,
		clearCache ? '--clearCache' : undefined,
		thresh ? `--coverageThreshold ${thresh}` : undefined,
		updateSnapshots ? '--updateSnapshots' : undefined,
		browser ? '--browser' : undefined,
	].filter(t => !!t)

	if (verbose) {
		log.info('jest arguments: ', args)
	}

	const result = await run({ exec: 'jest', args, toConsole: verbose })
	return result.code
}
