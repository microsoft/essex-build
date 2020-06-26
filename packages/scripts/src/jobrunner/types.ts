/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface RunArg {
	id?: string
	exec: string
	args: unknown[]
	/**
	 * A mapping of result codes to target codes. This is useful for when
	 * a tool returns a non-zero code for what we consider success.
	 */
	codeMap?: Record<number, number>

	/**
	 * Whether output should be redirected to the current process stdio. default=true
	 */
	toConsole?: boolean
}

/**
 * The result of a job run
 */
export interface RunResult {
	output?: string
	error?: string
	code: number
}
