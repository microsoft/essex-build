/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import path from 'path'
import url from 'url'

export function fileUrl(...parts: string[]): string {
	return url.pathToFileURL(path.join(...parts)).href
}
