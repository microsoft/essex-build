/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpawnOptions, ChildProcess } from 'child_process'
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
	npx,
	toConsole = true,
}: Job): Promise<JobResult> {
	const options = getInitialSpawnOptions(toConsole)
	if (exec === 'yarn') {
		scrubEnvVars(options.env || {})
	}

	try {
		const spawned = npx
			? (spawn(
					'npx',
					['-q', ...npxPackages(npx), exec, ...args],
					options,
			  ) as ChildProcess)
			: (spawn(exec, args, options) as ChildProcess)
		let output = ''
		let error = ''
		if (!toConsole) {
			if (spawned && spawned.stdout && spawned.stderr) {
				spawned.stdout.on('data', data => (output += data.toString()))
				spawned.stderr.on('data', data => (error += data.toString()))
			}
		}

		return new Promise<JobResult>((resolve, reject) => {
			spawned.on('error', err => reject(err))
			spawned.on('close', childCode => {
				let code = childCode
				if (childCode != null && codeMap[childCode] != null) {
					code = codeMap[childCode]
				}
				code = code ?? 0
				resolve({
					output,
					error,
					code,
				})
			})
		})
	} catch (err) {
		console.log(`error spawning process ${exec}`, err)
		return Promise.resolve({ code: 99999 })
	}
}

function getInitialSpawnOptions(toConsole: boolean): SpawnOptions {
	const cwd = process.cwd()
	const stdio = toConsole ? 'inherit' : undefined
	return {
		cwd,
		env: process.env,
		stdio,
	} as SpawnOptions
}

function scrubEnvVars(env: Record<string, string | undefined>): void {
	Object.keys(env).forEach(envVar => {
		if (envVar.startsWith('npm_')) {
			delete env[envVar]
		}
	})
}

function npxPackages(npx: boolean | string[]): string[] {
	if (!Array.isArray(npx)) {
		return []
	}
	const result: string[] = []
	npx.forEach(p => result.push('-p', p))
	return result
}
