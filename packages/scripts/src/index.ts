#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import { readdirSync } from 'fs'
import { join } from 'path'
import * as program from 'commander'

const commandDir = join(__dirname, '/commands')

program.version('0.1.0')

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
