/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { performance } from 'perf_hooks'
import chalk from 'chalk'

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

export function subtaskFail(text: string, err?: Error | undefined): void {
	if (err) {
		console.error(err)
	}
	console.log(chalk.red(`    ✘ ${text}`))
}

export function subtaskSuccess(text: string, ...args: unknown[]): void {
	console.log(chalk.green(`    ✔ ${text}`), ...args)
}

export function subtaskComplete(): void {
	console.log(chalk.green('      ✔ Complete'))
}

export function printPerf(start = 0, end = performance.now()): string {
	const span = end - start
	return `(${span.toFixed(2)}ms)`
}

export function timestamp(): string {
	const now = new Date()
	const fmt = (num: number) => num.toString().padStart(2, '0')
	return `${fmt(now.getHours())}:${fmt(now.getMinutes())}:${fmt(
		now.getSeconds(),
	)}`
}

export function traceFile(file: string, operation: string): void {
	info(`[${chalk.grey(timestamp())}] ${operation} ${chalk.blueBright(file)}`)
}
