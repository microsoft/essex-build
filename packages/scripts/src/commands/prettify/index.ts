/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { prettyQuick } from '@essex/build-step-pretty-quick'
import { resolveShellCode } from '@essex/build-utils'
import { Command } from 'commander'

interface PrettifyCommandOptions {
	verbose?: boolean
	staged?: boolean
}

/**
 * Runs the prettier tool to format client source code
 * @param program The CLI program
 */
export default function prettify(program: Command): void {
	program
		.command('prettify')
		.option('-v, --verbose', 'verbose output')
		.option('--staged', 'run on staged files')
		.action(({ staged, verbose }: PrettifyCommandOptions) => {
			prettyQuick({
				staged,
				verbose,
			})
				.then(...resolveShellCode())
				.then(code => process.exit(code))
		})
}
