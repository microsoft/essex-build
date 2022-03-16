/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import build from '@ladle/react/api/build.js'
import fs from 'fs'

export async function buildStories() {
	fs.mkdirSync('./dist/stories', { recursive: true })
	await build({
		out: 'dist/stories',
	})
}
