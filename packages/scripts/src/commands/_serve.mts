/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { webpackServe } from '../steps/webpack/serve.mjs'

interface ServeOptions {
	env?: string
	mode?: 'development' | 'production'
}

/**
 * Use Webpack to serve a webpack-based application.
 * @param program The CLI program
 */
export default function serve(program: Command): void {
	program
		.command('serve')
		.description('serve webpack-based webapp')
		.option('--env <env>', 'build environment', 'development')
		.option(
			'--mode <mode>',
			'enable production optimization or development hints ("development" | "production" | "none")',
			'development',
		)
		.action(
			async ({ env = 'development', mode = 'development' }: ServeOptions) => {
				await webpackServe({ env, mode })
			},
		)
}
