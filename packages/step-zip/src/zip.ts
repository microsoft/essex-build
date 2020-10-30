/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs, createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'
import glob from 'glob'

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

	const fileEntries = await getFileEntries(sources, workingDirectory)
	await archive(destinationPath, fileEntries)
	return 0
}

async function getFileEntries(
	sources: string[],
	workingDirectory: string,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		const sourcePath = path.join(workingDirectory, source)
		if (source.indexOf('*') >= 0) {
			result.push(...(await getGlobSource(sourcePath)))
		} else {
			result.push(...(await getSourceFiles(sourcePath)))
		}
	}
	return result.map(absFilePath => path.relative(workingDirectory, absFilePath))
}

function getGlobSource(source: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		glob(source, (err, files) => {
			if (err) {
				reject(err)
			} else {
				resolve(files)
			}
		})
	})
}

async function getSourceFiles(source: string): Promise<string[]> {
	const stats = await fs.stat(source)

	if (stats.isDirectory()) {
		return await walkDir(source)
	} else if (stats.isFile()) {
		return [source]
	} else {
		console.warn(`${source} is not a file or directory. Unable to compress.`)
		return []
	}
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

		for (const entry of fileEntries) {
			archive.file(entry, {
				name: entry,
			})
		}

		archive.finalize()
	})
}
