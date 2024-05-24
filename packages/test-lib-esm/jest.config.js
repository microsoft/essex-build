/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { configure } = require('@essex/jest-config')

// biome-ignore lint/style/noDefaultExport: jest config
export default configure({ esm: true })
