/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs, createWriteStream } from 'fs'
import * as path from 'path'
import * as archiver from 'archiver'
import * as glob from 'glob'

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
	await archive(workingDirectory, destinationPath, fileEntries)
	return 0
}

async function getFileEntries(
	sources: string[],
	workingDirectory: string,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		if (source.indexOf('*') >= 0) {
			result.push(...(await getGlobSource(source)))
		} else {
			result.push(...(await getSourceFiles(source, workingDirectory)))
		}
	}
	return result
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

async function getSourceFiles(
	source: string,
	workingDirectory: string,
): Promise<string[]> {
	const stats = await fs.stat(source)

	if (stats.isDirectory()) {
		const files = await walkDir(source)
		return files.map(f => path.relative(workingDirectory, f))
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
