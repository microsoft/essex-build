/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Command } from 'commander'

import { serveStories } from '../steps/stories/index.mjs'

interface ServeStoriesOptions {}

/**
 * Runs the prettier tool to format client source code
 * @param program The CLI program
 */
export default function prettify(program: Command): void {
	program.command('serve-stories').action(async ({}: ServeStoriesOptions) => {
		await serveStories()
	})
}
