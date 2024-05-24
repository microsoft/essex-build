/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { buildMdIndex as executeBuildMdIndex } from '../steps/build-md-index/index.mjs'

export interface BuildMdIndexCommandOptions {
	include: string
}

// biome-ignore lint/style/noDefaultExport: this is a CLI command
export default function buildMdIndex(program: Command): void {
	program
		.command('build-md-index')
		.description('builds a markdown index package')
		.option('--include <folder>', 'the markdown path to walk')
		.action(async (options: BuildMdIndexCommandOptions): Promise<void> => {
			await executeBuildMdIndex(options.include)
		})
}
