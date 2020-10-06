/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as chalk from 'chalk'
const { logger } = require('just-scripts')

export function info(text: string, ...args: unknown[]): void {
	logger.info(text, ...args)
}

export function error(text: string, ...args: unknown[]): void {
	logger.error(text, ...args)
}

export function warn(text: string, ...args: unknown[]): void {
	logger.warn(text, ...args)
}

export function success(text: string, ...args: unknown[]): void {
	logger.info(chalk.green(`🎉 ${text}`), ...args)
}

export function fail(text: string, ...args: unknown[]): void {
	logger.info(chalk.red(`🔥 ${text}`), ...args)
}

export function subtask(text: string): void {
	logger.info(chalk.cyan(`  * ${text}`))
}

export function subtaskInfo(text: string): void {
	logger.info(chalk.white(`    - ${text}`))
}

export function subtaskFail(text: string, err?: Error | undefined): void {
	logger.info(chalk.red(`    ✘ ${text}`))
	if (err) {
		logger.error(err)
	}
}

export function subtaskSuccess(text: string): void {
	logger.info(chalk.green(`    ✔ ${text}`))
}

export function subtaskComplete(): void {
	logger.info(chalk.green('      ✔ Complete'))
}
