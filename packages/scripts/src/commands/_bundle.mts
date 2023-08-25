/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { checkAndEmitTypings } from '../steps/typescript/checkAndEmitTypings.mjs'
import { getSourceFiles } from '../steps/typescript/getSourceFiles.mjs'
import { webpackBuild } from '../steps/webpack/build.mjs'

interface BundleOptions {
	env?: string
	mode?: 'development' | 'production'
}

/**
 * Runs the prettier tool to format client source code
 * @param program The CLI program
 */
export default function bundle(program: Command): void {
	program
		.command('bundle')
		.description('bundle a webpack-based application')
		.option('--env <env>', 'build environment', 'production')
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'production',
		)
		.action(
			async ({ env = 'production', mode = 'production' }: BundleOptions) => {
				const sourceFiles = await getSourceFiles()
				await checkAndEmitTypings(sourceFiles, false, false, true)
				await webpackBuild({ env, mode })
			},
		)
}
