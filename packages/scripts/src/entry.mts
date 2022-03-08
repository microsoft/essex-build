/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import chalk from 'chalk'
import { program } from 'commander'
import { readdirSync } from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'
import { exit } from 'process'
import { fileURLToPath } from 'url'

import { fileUrl } from './util/fileUrl.mjs'
import { isDebug } from './util/isDebug.mjs'
import { readScriptsPackageJson } from './util/package.mjs'
import { error, fail, info, printPerf, success } from './util/tasklogger.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const commandDir = path.join(__dirname, '/commands')

function establishErrorHandlers(): void {
	process
		.on('unhandledRejection', (reason, p) => {
			console.log(reason, 'unhandled promise rejection', p)
			process.exit(1)
		})
		.on('uncaughtException', err => {
			console.log(err, 'uncaught exception')
			process.exit(1)
		})
}

async function loadCommand(file: string): Promise<void> {
	const start = performance.now()
	const commandPath = fileUrl(commandDir, file)
	try {
		const command = await import(commandPath)
		if (command.default) {
			command.default(program)
		} else {
			command(program)
		}
		if (isDebug()) {
			info(`load command ${file} ${printPerf(start)}`)
		}
	} catch (err) {
		if (isDebug()) {
			console.error(`unable to load command ${file}`, err)
		}
	}
}

async function loadAllCommands(): Promise<void> {
	const commands = readdirSync(commandDir)
	await Promise.all(commands.map(loadCommand))
}

async function bootstrap(command: string) {
	const { version } = await readScriptsPackageJson()
	program.version(version)

	if (command !== '-h' && command !== '--help') {
		// Hot route: instead of requiring all commands, only require the one necessary
		try {
			await loadCommand(`_${command}.mjs`)
		} catch (err) {
			error(
				`unknown command "${command}".\nSee --help for a list of available commands.`,
			)
		}
	} else {
		await loadAllCommands()
	}

	// error on unknown commands
	program.on('command:*', () => {
		console.log(
			'Invalid command: %s\nSee --help for a list of available commands.',
			program.args.join(' '),
		)
		process.exit(1)
	})
}

async function execute() {
	const command = process.argv[2] as string
	try {
		establishErrorHandlers()
		await bootstrap(command)
		const end = performance.now()
		if (isDebug()) {
			info(chalk.green(`essex scripts ready (${(end - 0).toFixed(2)}ms)`))
		}
		await program.parseAsync(process.argv)

		if (!process.exitCode) {
			success(command, printPerf())
		} else {
			fail(command, printPerf())
		}
	} catch (err) {
		console.log(err)
		fail(command)
		exit(1)
	}
}
execute()
