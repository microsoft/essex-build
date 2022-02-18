/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { configure } = require('@essex/jest-config')

export default configure({ esm: true })
