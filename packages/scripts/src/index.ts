#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'supports-color'
import '@essex/eslint-plugin'
import '@essex/eslint-config'
import { readdirSync } from 'fs'
import { join } from 'path'
import * as program from 'commander'

process
	.on('unhandledRejection', (reason, p) => {
		console.error(reason, 'Unhandled Rejection at Promise', p)
		process.exit(1)
	})
	.on('uncaughtException', err => {
		console.error(err, 'Uncaught Exception thrown')
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
