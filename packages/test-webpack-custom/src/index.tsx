/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// @ts-ignore
import { createRoot } from 'react-dom/client'

import { App } from './App.js'

const rootElement = document.createElement('div')
const root = createRoot(rootElement)
root.render(<App />)
