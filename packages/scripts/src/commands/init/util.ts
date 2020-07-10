/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import { fileExists, rootDir, copyFilePromise } from '../../utils'
import * as log from '@essex/tasklogger'

export function copyConfigFile(file: string): Promise<number> {
	const scriptPath = join(rootDir, `config/${file}`)
	const pkgPath = join(process.cwd(), file)

	return fileExists(pkgPath).then(pkgFileExists => {
		if (pkgFileExists) {
			log.error(
				`cannot init file ${file}; it already exists in the target directory`,
			)
			return 1
		} else {
			return copyFilePromise(scriptPath, pkgPath).then(() => 0)
		}
	})
}
