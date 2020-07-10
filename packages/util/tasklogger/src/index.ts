/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as chalk from 'chalk'

export function info(text: string, ...args: unknown[]): void {
	console.log(chalk.white(text), ...args)
}

export function error(text: string, ...args: unknown[]): void {
	console.log(chalk.red(text), ...args)
}

export function warn(text: string, ...args: unknown[]): void {
	console.log(chalk.yellow.bold(text), ...args)
}

export function success(text: string, ...args: unknown[]): void {
	console.log(chalk.green(`🎉 ${text}`), ...args)
}

export function fail(text: string, ...args: unknown[]): void {
	console.log(chalk.red(`🔥 ${text}`), ...args)
}

export function subtask(text: string): void {
	console.log(chalk.cyan(`  * ${text}`))
}

export function subtaskInfo(text: string): void {
	console.log(chalk.white(`    - ${text}`))
}

export function subtaskFail(text: string): void {
	console.log(chalk.red(`    ✘ ${text}`))
}

export function subtaskSuccess(text: string): void {
	console.log(chalk.green(`    ✔ ${text}`))
}

export function subtaskComplete(): void {
	console.log(chalk.green('      ✔ Complete'))
}

export function resolveGulpTask(
	title: string,
	cb: (err?: Error) => void,
): [() => void, (err: Error) => void] {
	return [
		() => {
			subtaskSuccess(title)
			cb()
		},
		err => {
			subtaskFail(title)
			cb(err)
		},
	]
}
