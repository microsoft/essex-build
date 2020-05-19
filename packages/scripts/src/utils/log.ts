/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'colors'

export function info(text: string, ...args: unknown[]): void {
	console.log(text.white, ...args)
}

export function error(text: string, ...args: unknown[]): void {
	console.log(text.red, ...args)
}

export function warn(text: string, ...args: unknown[]): void {
	console.log(text.yellow.bold, ...args)
}

export function success(text: string, ...args: unknown[]): void {
	console.log(text.green, ...args)
}

export function fail(text: string, ...args: unknown[]): void {
	console.log(text.red, ...args)
}

export function subtask(text: string): void {
	console.log(`  * ${text}`.cyan)
}

export function subtaskInfo(text: string): void {
	console.log(`    - ${text}`.white)
}

export function subtaskFail(text: string): void {
	console.log(`    ✘ ${text}`.red)
}

export function subtaskSuccess(text: string): void {
	console.log(`    ✔ ${text}`.green)
}

export function subtaskComplete(): void {
	console.log('      ✔ Complete'.green)
}
