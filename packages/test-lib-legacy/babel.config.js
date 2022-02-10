/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// The babel configuration is required at the monorepo root for Jest. Jest will
// automatically use this configuration to process JavaScript and TypeScript
// sources by default. These plugins should be installed as devDependencies at
// the jest testing root, usually the root of the monorepo, in addition to
// @babel/core
const { getNodeConfiguration } = require('@essex/babel-config')
module.exports = getNodeConfiguration()
