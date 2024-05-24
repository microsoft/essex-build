/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
// @ts-ignore
import { createRoot } from 'react-dom/client'

import { App } from './App.js'

const rootElement = document.createElement('div')
document.body.appendChild(rootElement)
const root = createRoot(rootElement)
root.render(<App />)
