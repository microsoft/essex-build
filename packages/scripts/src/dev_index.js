#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const chalk = require('chalk')
const { join } = require('path')
const { performance } = require('perf_hooks')

const start = performance.now()
require('ts-node').register({
	project: join(__dirname, '..', 'tsconfig.json'),
})
const end = performance.now()
if (process.env.ESSEX_DEBUG) {
	console.log(chalk.green(`initialize ts-node ${printPerf(start, end)}`))
}
require('./entry')
