/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { storybookStart } from '@essex/build-step-storybook'
import { Command } from 'commander'

interface StartStorybookCommandOptions {
	verbose: boolean
}

export default function start(program: Command): void {
	program
		.command('start-storybook')
		.description('starts the storybook server on the current package')
		.option('-v, --verbose', 'verbose output')
		.action((options: StartStorybookCommandOptions) => {
			return Promise.resolve()
				.then(() => storybookStart(options.verbose))
				.catch(err => {
					console.log('error starting storybook', err)
					process.exitCode = 1
				})
		})
}
