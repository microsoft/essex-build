/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs, createWriteStream, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { error, info, traceFile } from '@essex/tasklogger'
import archiver from 'archiver'
import chalk from 'chalk'
import glob from 'glob'
import ProgressBar from 'progress'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const format = require('human-format')

export interface ZipCommandOptions {
	baseDir: string
}

export async function zip(
	destination: string,
	sources: string[],
	{ baseDir }: ZipCommandOptions,
): Promise<number> {
	const outputDir = resolve(dirname(destination))
	if (!existsSync(outputDir)) {
		info('creating output folder', outputDir)
		mkdirSync(outputDir, { recursive: true })
	}
	const fileEntries = await getFileEntries(sources, baseDir)
	info(
		`archiving ${chalk.green(destination)} from base dir ${chalk.blueBright(
			baseDir,
		)} and sources ${sources.map(s => chalk.blueBright(s)).join(', ')}`,
	)

	info(`including ${fileEntries.length} files`)
	if (process.env.ESSEX_DEBUG) {
		fileEntries.forEach(e => traceFile(e, 'zip'))
	}
	await archive(destination, fileEntries, baseDir)
	return 0
}

async function getFileEntries(
	sources: string[],
	baseDir: string,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		const sourcePath = join(baseDir, source)
		const foundFiles =
			source.indexOf('*') >= 0
				? // handle globs
				  await getGlobSource(sourcePath)
				: // handle files
				  await getSourceFiles(sourcePath)
		const isIncluded = await Promise.all(foundFiles.map(isZippable))
		const filteredFiles = foundFiles.filter((_t, i) => isIncluded[i])

		if (process.env.ESSEX_DEBUG) {
			filteredFiles.forEach(f => traceFile(f, `expand ${source}`))
		}
		result.push(...filteredFiles)
	}
	return result.map(file => relative(baseDir, file))
}

function getGlobSource(source: string): Promise<string[]> {
	if (process.env.ESSEX_DEBUG) {
		info('handle source glob: ' + source)
	}
	return new Promise<string[]>((resolve, reject) => {
		glob(source, { dot: true }, (err, files) => {
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
			const filePath = join(currentDirectoryPath, file)
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
	const bar = new ProgressBar(':percent :bar', {
		total: fileEntries.length,
		width: 80,
		complete: '=',
		incomplete: '-',
	})
	return new Promise(async (resolve, reject) => {
		const output = createWriteStream(destination)
		const archive = archiver('zip')

		output.on('close', () => {
			console.log(
				`archive complete - ${chalk.green(destination)} ${chalk.grey(
					format(archive.pointer(), {
						scale: 'binary',
						unit: 'B',
					}),
				)}`,
			)
			resolve()
		})
		archive.on('entry', () => {
			bar.tick()
		})

		archive.on('warning', reject)
		archive.on('error', reject)
		archive.pipe(output)

		for (const entry of fileEntries) {
			const entryPath = join(cwd, entry)
			archive.file(entryPath, {
				name: entry,
			})
		}

		info('finalizing archive')
		archive.finalize()
	})
}

async function isZippable(file: string): Promise<boolean> {
	const stat = await fs.stat(file)
	return !stat.isSymbolicLink() && !stat.isDirectory() && stat.isFile()
}
