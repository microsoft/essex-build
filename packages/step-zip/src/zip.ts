/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs, createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'
import glob from 'glob'
import chalk from 'chalk'
import { error, info, traceFile } from '@essex/tasklogger'
const format = require('human-format')
export interface ZipCommandOptions {
	cwd: string
}

export async function zip(
	destination: string,
	sources: string[],
	{ cwd }: ZipCommandOptions,
): Promise<number> {
	const fileEntries = await getFileEntries(sources, cwd)
	info(
		`archiving ${chalk.green(destination)} from base path ${chalk.blueBright(
			cwd,
		)} and sources ${sources.map(s => chalk.blueBright(s)).join(', ')}`,
	)
	fileEntries.forEach(e => traceFile(e, 'zip'))
	await archive(destination, fileEntries, cwd)
	return 0
}

async function getFileEntries(
	sources: string[],
	cwd: string,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		const sourcePath = path.join(cwd, source)
		const foundFiles =
			source.indexOf('*') >= 0
				? // handle globs
				  await getGlobSource(sourcePath)
				: // handle files
				  await getSourceFiles(sourcePath)

		if (process.env.ESSEX_DEBUG) {
			foundFiles.forEach(f => traceFile(f, `expand ${source}`))
		}
		result.push(...foundFiles)
	}
	return result.map(file => path.relative(cwd, file))
}

function getGlobSource(source: string): Promise<string[]> {
	if (process.env.ESSEX_DEBUG) {
		info('handle source glob: ' + source)
	}
	return new Promise<string[]>((resolve, reject) => {
		glob(source, (err, files) => {
			if (err) {
				error('glob error', error)
				reject(err)
			} else {
				resolve(files)
			}
		})
	})
}

async function getSourceFiles(source: string): Promise<string[]> {
	if (process.env.ESSEX_DEBUG) {
		info('handle source file: ' + source)
	}
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
	cwd: string,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const output = createWriteStream(destination)
		const archive = archiver('zip')

		output.on('close', () => {
			console.log(
				`archive complete - ${chalk.green(destination)} ${chalk.grey(
					format(archive.pointer() * 1000, {
						scale: 'binary',
						unit: 'B',
					}),
				)}`,
			)
			resolve()
		})

		archive.on('warning', reject)
		archive.on('error', reject)
		archive.pipe(output)

		for (const entry of fileEntries) {
			archive.file(path.join(cwd, entry), {
				name: entry,
			})
		}

		archive.finalize()
	})
}
