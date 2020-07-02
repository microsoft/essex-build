/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { exists, existsSync, copyFile } from 'fs'
import { join } from 'path'

/**
 * Root directory within essex-scripts package
 */
export const rootDir = join(__dirname, '../../')

/**
 * Directory where default configuration files are stored
 */
export const configDir = join(rootDir, 'config')

/**
 * User's home directory
 */
export const homeDir =
	process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE

export const fileExists = (file: string): Promise<boolean> =>
	new Promise(resolve => exists(file, is => resolve(is)))

export const copyFilePromise = (
	source: string,
	target: string,
): Promise<void> =>
	new Promise((resolve, reject) => {
		copyFile(source, target, err => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})

/**
 * A local utility to determine if a file exists
 * @param file The file's path
 */
function fileIfExists(
	file: string,
	fallback?: string | false,
): Promise<string | undefined> {
	if (fallback === false) {
		return Promise.resolve(file)
	}
	return fileExists(file).then(is => (is ? file : fallback))
}

/**
 * A local utility to determine if a file exists
 * @param file The file's path
 */
function fileIfExistsSync(
	file: string,
	fallback?: string | false,
): string | undefined {
	if (fallback === false) {
		return file
	}
	return existsSync(file) ? file : fallback
}

/**
 * Returns the absolute path of the file relative to the essex-scripts package
 * @param file The file to get the path for
 */
export function getEssexScriptsPath(
	file: string,
	fallback?: string | false,
): Promise<string | undefined> {
	const configPath = join(configDir, file)
	return fileIfExists(configPath, fallback)
}

/**
 * Returns the absolute path of the file relative to the essex-scripts package
 * @param file The file to get the path for
 */
export function getEssexScriptsPathSync(
	file: string,
	fallback?: string | false,
): string | undefined {
	const configPath = join(configDir, file)
	return fileIfExistsSync(configPath, fallback)
}

/**
 * Returns the absolute path of the file relative to the user's home directory
 * @param file The file to get the path for
 */
export function getHomePath(
	file: string,
	fallback?: string | false,
): Promise<string | undefined> {
	if (!homeDir) {
		return Promise.resolve(undefined)
	}
	const finalPath = join(homeDir, file)
	return fileIfExists(finalPath, fallback)
}

/**
 * Returns the absolute path of the file relative to the user's CWD
 * @param file The file to get the path for
 * @param checkExists If the file should be checked for existence
 */
export function getProjectPath(
	file: string,
	fallback?: string | false,
): Promise<string | undefined> {
	const filePath = join(process.cwd(), file)
	return fileIfExists(filePath, fallback)
}

/**
 * Returns the absolute path of the file relative to the user's local directory or the essex-scripts directory
 * if there is no local one
 * @param file The file to get the path for
 */
export function getConfigPath(
	file: string,
	essexFile: string = file,
): Promise<string | undefined> {
	return Promise.all([
		getProjectPath(file),
		// TODO: (chris)- I'm not sure about using home paths to override a config file.
		// this will lead to local builds differing from CI or other developer machines
		// because of a sticky config in a home dir.
		getHomePath(file),
		getEssexScriptsPath(essexFile),
	]).then(([local, home, essex]) => local || home || essex)
}
