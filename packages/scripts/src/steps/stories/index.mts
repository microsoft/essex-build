/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable-next-line */
// @ts-ignore
import build from '@ladle/react/build'
/* eslint-disable-next-line */
// @ts-ignore
import serve from '@ladle/react/serve'
import fs from 'fs'

import { never } from '../../util/never.mjs'

export async function buildStories() {
	fs.mkdirSync('./dist/stories', { recursive: true })
	await build({
		out: 'dist/stories',
	})
}

export async function serveStories() {
	await serve({
		port: 6006,
		open: true,
	})
	return never()
}
