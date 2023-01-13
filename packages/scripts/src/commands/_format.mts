/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { runFormatter } from '../steps/runFormatter.js'
import type { Formatter } from '../types.mjs'

interface FormatCommandOptions {
	verbose?: boolean | undefined
	formatter?: Formatter
}

/**
 * Runs the prettier tool to format client source code
 * @param program The CLI program
 */
export default function format(program: Command): void {
	program
		.command('format')
		.option('-v, --verbose', 'verbose output')
		.option('--formatter [formatter]', 'the formatter to use ("prettier", "rome", or "none")')
		.action(async ({ verbose, formatter }: FormatCommandOptions) => {
			await runFormatter(formatter, true, verbose)
		})
}
