#!/usr/bin/env node
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { join } = require('path')
require('ts-node').register({
	project: join(__dirname, '..', 'tsconfig.json'),
})
require('./entry')
