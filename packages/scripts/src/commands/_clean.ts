/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import rimraf from 'rimraf'

export default function clean(program: Command): void {
	program
		.command('clean [files...]')
		.description('cleans up build artifact directories')
		.action(async (files: string[]) => {
			if (files.length === 0) {
				files = ['lib', 'dist']
			}

			await Promise.all(files.filter(f => !!f).map(f => rm(f)))
		})
}

function rm(fileglob: string): Promise<void> {
	return new Promise((resolve, reject) => {
		rimraf(fileglob, (err: Error | null | undefined) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
