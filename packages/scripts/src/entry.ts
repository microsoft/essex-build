/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import { exit } from 'process'
import chalk from 'chalk'
import { program } from 'commander'
import { error, info, printPerf, fail, success } from './util/tasklogger'

const commandDir = join(__dirname, '/commands')

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

function loadCommand(file: string): void {
	const start = performance.now()
	const commandPath = join(commandDir, file)
	if (!existsSync(commandPath)) {
		throw new Error(`command not found: ${commandPath}`)
	}
	try {
		const command = require(commandPath)
		if (command.default) {
			command.default(program)
		} else {
			command(program)
		}
		if (process.env.ESSEX_DEBUG) {
			info(`load command ${file} ${printPerf(start)}`)
		}
	} catch (err) {
		console.log('error loading %s', commandPath, err)
		throw err
	}
}

function loadAllCommands(): void {
	const commands = readdirSync(commandDir)
	commands.forEach(file => loadCommand(file))
}

async function bootstrap(command: string) {
	const { version } = require('../package.json')
	program.version(version)

	if (command !== '-h' && command !== '--help') {
		// Hot route: instead of requiring all commands, only require the one necessary
		try {
			loadCommand(`_${command}`)
		} catch (err) {
			error(
				`unknown command "${command}".\nSee --help for a list of available commands.`,
			)
		}
	} else {
		loadAllCommands()
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
	const command = process.argv[2]
	try {
		establishErrorHandlers()
		await bootstrap(command)
		const end = performance.now()
		if (process.env.ESSEX_DEBUG) {
			info(chalk.green(`essex scripts ready (${(end - 0).toFixed(2)}ms)`))
		}
		await program.parseAsync(process.argv)

		if (process.exitCode === 0) {
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
