/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { exists, copyFile } from 'fs'
import path from 'path'
import * as log from '../../util/tasklogger.mjs'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function copyConfigFile(file: string, dot = false): Promise<number> {
	const scriptPath = path.join(__dirname, `../../../config/init/${file}`)
	const pkgPath = path.join(process.cwd(), `${dot ? '.' : ''}${file}`)

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

export const fileExists = (file: string): Promise<boolean> =>
	new Promise(resolve => exists(file, is => resolve(is)))

function copyFilePromise(source: string, target: string): Promise<void> {
	return new Promise((resolve, reject) => {
		copyFile(source, target, err => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
