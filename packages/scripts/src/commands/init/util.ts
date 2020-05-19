/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fileExists, rootDir, log, copyFilePromise } from '../../utils'
import { join } from 'path'

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
