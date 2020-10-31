/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
require('./babel-debug')
const { configure } = require('@essex/storybook-config/lib/main')
module.exports = configure({ pnp: true })
