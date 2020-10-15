/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
