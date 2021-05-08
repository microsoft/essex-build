/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'
import program from 'commander'
import gulp from 'gulp'
import { processStart, now } from './timers'
import { error, info, printPerf } from '@essex/tasklogger'

const commandDir = join(__dirname, '/commands')

function establishErrorHandlers(): void {
	gulp.on('error', () => {
		if (!process.env.ESSEX_DEBUG) {
			process.exit(1)
		}
	})

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
	const start = now()
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
		const end = now()
		if (process.env.ESSEX_DEBUG) {
			info(`load command ${file} ${printPerf(start, end)}`)
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

async function bootstrap() {
	const { version } = require('../package.json')
	const command = process.argv[2]
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
	establishErrorHandlers()
	await bootstrap()
	const end = now()
	if (process.env.ESSEX_DEBUG) {
		info(
			chalk.green(
				`essex scripts ready (${(end - processStart()).toFixed(2)}ms)`,
			),
		)
	}
	program.parse(process.argv)
}
execute()
