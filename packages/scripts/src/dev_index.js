#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/* eslint-disable import/order */
const { join } = require('path')
const { performance } = require('perf_hooks')
const start = performance.now()

const chalk = require('chalk')
require('ts-node').register({
	project: join(__dirname, '..', 'tsconfig.json'),
	transpileOnly: true,
})
const { info, printPerf } = require('./util/tasklogger')

if (process.env.ESSEX_DEBUG) {
	info(chalk.green(`initialize devMode ${printPerf(start)}`))
}
require('./entry')
