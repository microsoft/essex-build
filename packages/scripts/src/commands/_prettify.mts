/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'
import { prettyQuick } from '../steps/pretty-quick/index.mjs'

interface PrettifyCommandOptions {
	verbose?: boolean | undefined
	staged?: boolean | undefined
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
		.action(async ({ staged, verbose }: PrettifyCommandOptions) => {
			await prettyQuick({
				staged,
				verbose,
			})
		})
}
