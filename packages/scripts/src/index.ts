#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { readdirSync } from 'fs'
import { join } from 'path'
import * as program from 'commander'
import * as gulp from 'gulp'

//gulp.on('error', () => process.exit(1))

process
	.on('unhandledRejection', (reason, p) => {
		console.error(reason, 'unhandled promise rejection', p)
		process.exit(1)
	})
	.on('uncaughtException', err => {
		console.error(err, 'uncaught exception')
		process.exit(1)
	})

const { version } = require('../package.json')
const commandDir = join(__dirname, '/commands')
program.version(version)

// Dynamically load all the commands
const commands = readdirSync(commandDir)
commands.forEach(file => {
	const commandPath = join(commandDir, file)
	try {
		const command = require(commandPath)
		if (command.default) {
			command.default(program)
		} else {
			command(program)
		}
	} catch (err) {
		console.error('error loading %s', commandPath, err)
		throw err
	}
})

// error on unknown commands
program.on('command:*', () => {
	console.error(
		'Invalid command: %s\nSee --help for a list of available commands.',
		program.args.join(' '),
	)
	process.exit(1)
})
program.parse(process.argv)
