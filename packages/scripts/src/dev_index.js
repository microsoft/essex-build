#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { join } = require('path')
const { performance } = require('perf_hooks')
const chalk = require('chalk')

const start = performance.now()
require('ts-node').register({
	project: join(__dirname, '..', 'tsconfig.json'),
})
const { info, printPerf } = require('@essex/tasklogger')
const end = performance.now()
if (process.env.ESSEX_DEBUG) {
	info(chalk.green(`initialize ts-node ${printPerf(start, end)}`))
}
require('./entry')
