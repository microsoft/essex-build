/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { existsSync } from 'fs'
import { join } from 'path'
import { log } from '../log.js'

export function getIndexFile(): string {
	const indexTsx = join(process.cwd(), 'src', 'index.tsx')
	const indexTs = join(process.cwd(), 'src', 'index.ts')
	const indexJsx = join(process.cwd(), 'src', 'index.jsx')
	const indexJs = join(process.cwd(), 'src', 'index.js')

	if (existsSync(indexTsx)) {
		log('entry: index.tsx')
		return indexTsx
	} else if (existsSync(indexTs)) {
		log('entry: index.ts')
		return indexTs
	} else if (existsSync(indexJsx)) {
		log('entry: index.jsx')
		return indexJsx
	} else {
		log('entry: index.js')
		return indexJs
	}
}
