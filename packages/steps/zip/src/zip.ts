/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs, createWriteStream } from 'fs'
import * as path from 'path'
import * as archiver from 'archiver'

export interface ZipCommandOptions {
	cwd: string
}

export async function zip(
	destination: string,
	sources: string[],
	{ cwd }: ZipCommandOptions,
): Promise<number> {
	const workingDirectory = path.resolve(cwd)
	const destinationPath = path.join(workingDirectory, destination)

	let fileEntries: string[] = []

	for (const source of sources) {
		const filePath = path.join(workingDirectory, source)
		const stats = await fs.stat(filePath)

		if (stats.isDirectory()) {
			const files = await walkDir(filePath)
			fileEntries = [
				...fileEntries,
				...files.map(f => path.relative(workingDirectory, f)),
			]
		} else if (stats.isFile()) {
			fileEntries = [...fileEntries, source]
		} else {
			console.warn(
				`${filePath} is not a file or directory. Unable to compress.`,
			)
		}
	}

	await archive(workingDirectory, destinationPath, fileEntries)

	return 0
}

async function walkDir(directory: string): Promise<string[]> {
	const directoryStack = [directory]

	let allFiles: string[] = []

	while (directoryStack.length) {
		const currentDirectoryPath: string = directoryStack.pop() as string
		const directoryFiles = await fs.readdir(currentDirectoryPath)

		for (const file of directoryFiles) {
			const filePath = path.join(currentDirectoryPath, file)
			const stats = await fs.stat(filePath)
			if (stats.isFile()) {
				allFiles = [...allFiles, filePath]
			} else if (stats.isDirectory()) {
				directoryStack.push(filePath)
			} else {
				console.warn(
					`${filePath} is not a file or directory. Skipping compression`,
				)
			}
		}
	}

	return allFiles
}

async function archive(
	workingDirectory: string,
	destination: string,
	fileEntries: string[],
): Promise<void> {
	return new Promise((resolve, reject) => {
		const output = createWriteStream(destination)
		const archive = archiver('zip')

		output.on('close', () => {
			console.log(
				`Archive complete. Total bytes of ${destination}: ${archive.pointer()}`,
			)
			resolve()
		})

		archive.on('warning', reject)

		archive.on('error', reject)

		archive.pipe(output)

		for (const relativeFilePath of fileEntries) {
			archive.file(
				path.resolve(path.join(workingDirectory, relativeFilePath)),
				{
					name: relativeFilePath,
				},
			)
		}

		archive.finalize()
	})
}
