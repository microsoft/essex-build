#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { join } = require('path')
const { performance } = require('perf_hooks')

const start = performance.now()
require('ts-node').register({
	project: join(__dirname, '..', 'tsconfig.json'),
})
const end = performance.now()
console.log(`initialize ts-node (${(end - start).toFixed(2)}ms)`)
require('./entry')
