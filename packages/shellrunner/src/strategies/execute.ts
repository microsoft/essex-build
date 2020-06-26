/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpawnOptions, ChildProcess } from 'child_process'
import { join } from 'path'
import { platform } from 'os'
import { Job, JobResult } from '../types'

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const spawn = require('cross-spawn')

/**
 * Runs the given executable with the given args
 * @param exec The executable
 * @param args The args to the executable
 * @param toConsole If the output should be written to the console
 */
export function execute({
	exec,
	args,
	codeMap = {},
	toConsole = true,
}: Job): Promise<JobResult> {
	const sep = platform().indexOf('win') === 0 ? ';' : ':'
	const options = {
		cwd: process.cwd(),
		env: {
			...process.env,
			PATH: `${join(process.cwd(), 'node_modules', '.bin')}${sep}${
				process.env.PATH
			}`,
		},
	} as SpawnOptions
	if (toConsole) {
		options.stdio = 'inherit'
	}
	if (exec === 'yarn') {
		const newEnv = { ...process.env }
		Object.keys(newEnv).forEach(name => {
			if (name.startsWith('npm_')) {
				delete newEnv[name]
			}
		})
		options.env = newEnv
	}

	const spawned = spawn(exec, args, options) as ChildProcess
	let output = ''
	let error = ''
	if (!toConsole) {
		if (spawned && spawned.stdout && spawned.stderr) {
			spawned.stdout.on('data', data => (output += data.toString()))
			spawned.stderr.on('data', data => (error += data.toString()))
		}
	}

	return new Promise<JobResult>(resolve => {
		spawned.on('close', code => {
			if (codeMap[code] != null) {
				return codeMap[code]
			}
			resolve({
				output,
				error,
				code,
			})
		})
	})
}
